import { locationsRepository } from './locations.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';
import { CreateLocationInput, UpdateLocationInput, LocationQueryInput } from '@toy-wms/shared';

export class LocationsService {
  private formatLocationWithUtilization(location: any) {
    let currentOccupancy = 0;
    if (location.stockLevels) {
      for (const sl of location.stockLevels) {
        currentOccupancy += sl.onHand;
      }
    }

    const utilizationPercent =
      location.capacity > 0
        ? Math.min(100, Math.round((currentOccupancy / location.capacity) * 100))
        : 0;

    return {
      ...location,
      currentOccupancy,
      utilizationPercent,
    };
  }

  async getLocations(query: LocationQueryInput) {
    const result = await locationsRepository.findMany(query);
    const items = result.items.map(this.formatLocationWithUtilization);
    return {
      ...result,
      items,
    };
  }

  async getLocationById(id: string) {
    const loc = await locationsRepository.findById(id);
    if (!loc) {
      throw AppError.notFound(`Location with ID ${id} not found`);
    }
    return this.formatLocationWithUtilization(loc);
  }

  async getLocationByBarcode(barcode: string) {
    const loc = await locationsRepository.findByBarcodeOrCode(barcode);
    if (!loc) {
      throw AppError.notFound(`Location with barcode/code "${barcode}" not found`);
    }
    return this.formatLocationWithUtilization(loc);
  }

  async createLocation(data: CreateLocationInput, userId: string, userEmail: string) {
    const created = await locationsRepository.create(data);

    await auditService.log({
      userId,
      userEmail,
      action: 'LOCATION_CREATED',
      entityType: 'Location',
      entityId: created.id,
      details: { code: created.code, barcode: created.barcode, type: created.type },
    });

    return this.formatLocationWithUtilization(created);
  }

  async updateLocation(id: string, data: UpdateLocationInput, userId: string, userEmail: string) {
    await this.getLocationById(id);
    const updated = await locationsRepository.update(id, data);

    await auditService.log({
      userId,
      userEmail,
      action: 'LOCATION_UPDATED',
      entityType: 'Location',
      entityId: updated.id,
      details: data,
    });

    return this.formatLocationWithUtilization(updated);
  }
}

export const locationsService = new LocationsService();
