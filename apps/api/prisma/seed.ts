import { PrismaClient, UserRole, LocationType, MovementType, ReferenceDocType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive Toy WMS database seeding...');

  // 1. Clear existing data in reverse dependency order
  console.log('🧹 Cleaning existing tables...');
  await prisma.auditLog.deleteMany();
  await prisma.shipmentTrackingEvent.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.packageItem.deleteMany();
  await prisma.package.deleteMany();
  await prisma.pickTask.deleteMany();
  await prisma.pickList.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.returnItem.deleteMany();
  await prisma.return.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.putawayTask.deleteMany();
  await prisma.gRNItem.deleteMany();
  await prisma.gRN.deleteMany();
  await prisma.purchaseOrderItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.supplierProductPrice.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.stockAdjustment.deleteMany();
  await prisma.inventoryLedger.deleteMany();
  await prisma.stockLevel.deleteMany();
  await prisma.packagingMaterial.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.location.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.warehouse.deleteMany();

  // 2. Seed Warehouse
  console.log('🏢 Seeding Distribution Center...');
  const warehouse = await prisma.warehouse.create({
    data: {
      code: 'BLR-TOY-DC-01',
      name: 'Bangalore Central Toy Fulfillment Center',
      addressLine1: 'Plot 42, Electronic City Phase 2',
      addressLine2: 'Hosur Road Industrial Area',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
      country: 'India',
      gstin: '29AABCU9603R1ZX',
      phone: '+91 80 4912 3456',
      email: 'dc.bangalore@toywms.in',
    },
  });

  // 3. Seed Users with RBAC
  console.log('👥 Seeding Users across all 4 roles...');
  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@toywms.in',
      passwordHash: defaultPasswordHash,
      name: 'Aarav Sharma (Admin)',
      role: UserRole.ADMIN,
      phone: '+91 98765 43210',
      warehouseId: warehouse.id,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@toywms.in',
      passwordHash: defaultPasswordHash,
      name: 'Priya Nair (DC Manager)',
      role: UserRole.WAREHOUSE_MANAGER,
      phone: '+91 98765 43211',
      warehouseId: warehouse.id,
    },
  });

  const workerUser = await prisma.user.create({
    data: {
      email: 'worker@toywms.in',
      passwordHash: defaultPasswordHash,
      name: 'Rohan Verma (Associate)',
      role: UserRole.WAREHOUSE_ASSOCIATE,
      phone: '+91 98765 43212',
      warehouseId: warehouse.id,
    },
  });

  const qcUser = await prisma.user.create({
    data: {
      email: 'qc@toywms.in',
      passwordHash: defaultPasswordHash,
      name: 'Ananya Deshmukh (QC Inspector)',
      role: UserRole.QC,
      phone: '+91 98765 43213',
      warehouseId: warehouse.id,
    },
  });

  // 4. Seed 42 Locations
  console.log('📍 Seeding 42 Warehouse Locations with route sequence...');
  const locationDefs: Array<{
    code: string;
    aisle: string;
    rack: string;
    shelf: string;
    bin: string;
    type: LocationType;
    capacity: number;
    pickSequence: number;
  }> = [];

  // Receiving (4 bins)
  for (let i = 1; i <= 4; i++) {
    locationDefs.push({
      code: `RCV-01-A-0${i}`,
      aisle: 'RCV',
      rack: '01',
      shelf: 'A',
      bin: `0${i}`,
      type: LocationType.RECEIVING,
      capacity: 500,
      pickSequence: 10 + i,
    });
  }

  // Bulk Storage Aisle A (16 bins)
  for (let r = 1; r <= 2; r++) {
    for (const s of ['A', 'B']) {
      for (let b = 1; b <= 4; b++) {
        locationDefs.push({
          code: `A-0${r}-${s}-0${b}`,
          aisle: 'A',
          rack: `0${r}`,
          shelf: s,
          bin: `0${b}`,
          type: LocationType.STORAGE,
          capacity: 200,
          pickSequence: 1000 + r * 100 + (s === 'A' ? 10 : 20) + b,
        });
      }
    }
  }

  // Forward Picking Aisle B (12 bins)
  for (let r = 1; r <= 2; r++) {
    for (const s of ['A', 'B', 'C']) {
      for (let b = 1; b <= 2; b++) {
        locationDefs.push({
          code: `B-0${r}-${s}-0${b}`,
          aisle: 'B',
          rack: `0${r}`,
          shelf: s,
          bin: `0${b}`,
          type: LocationType.PICKING,
          capacity: 100,
          pickSequence: 2000 + r * 100 + (s.charCodeAt(0) - 64) * 10 + b,
        });
      }
    }
  }

  // Specialized zones: Packing, Staging, Returns, Damaged, QC (2 bins each)
  const specializedTypes: Array<{ prefix: string; type: LocationType }> = [
    { prefix: 'PCK', type: LocationType.PACKING },
    { prefix: 'STG', type: LocationType.STAGING },
    { prefix: 'RET', type: LocationType.RETURNS },
    { prefix: 'DMG', type: LocationType.DAMAGED },
    { prefix: 'QC', type: LocationType.QC },
  ];

  specializedTypes.forEach(({ prefix, type }, idx) => {
    for (let b = 1; b <= 2; b++) {
      locationDefs.push({
        code: `${prefix}-01-A-0${b}`,
        aisle: prefix,
        rack: '01',
        shelf: 'A',
        bin: `0${b}`,
        type,
        capacity: 150,
        pickSequence: 8000 + idx * 100 + b,
      });
    }
  });

  const locationsMap = new Map<string, any>();
  for (const loc of locationDefs) {
    const createdLoc = await prisma.location.create({
      data: {
        warehouseId: warehouse.id,
        code: loc.code,
        aisle: loc.aisle,
        rack: loc.rack,
        shelf: loc.shelf,
        bin: loc.bin,
        type: loc.type,
        barcode: `LOC-${loc.code.replace(/-/g, '')}`,
        capacity: loc.capacity,
        pickSequence: loc.pickSequence,
      },
    });
    locationsMap.set(loc.code, createdLoc);
  }

  // 5. Seed Categories & Brands
  console.log('🏷️ Seeding Toy Categories and Brands...');
  const catSTEM = await prisma.category.create({
    data: { name: 'STEM & Robotics', slug: 'stem-robotics', description: 'Coding toys, scientific sets and electronic kits' },
  });
  const catBlocks = await prisma.category.create({
    data: { name: 'Building Blocks & Sets', slug: 'building-blocks', description: 'Plastic & wooden construction sets' },
  });
  const catGames = await prisma.category.create({
    data: { name: 'Board Games & Puzzles', slug: 'board-games', description: 'Strategy games, jigsaw puzzles and brain teasers' },
  });
  const catVehicles = await prisma.category.create({
    data: { name: 'RC Vehicles & Die-Cast', slug: 'rc-vehicles', description: 'Remote control cars, helicopters and diecast models' },
  });
  const catInfant = await prisma.category.create({
    data: { name: 'Infant & Toddler Toys', slug: 'infant-toddler', description: 'Safe rattles, musical toys and sensory play' },
  });
  const catAction = await prisma.category.create({
    data: { name: 'Action Figures & Dolls', slug: 'action-dolls', description: 'Hero figures, dolls and playsets' },
  });

  const brandSpeedBots = await prisma.brand.create({
    data: { name: 'SpeedBots Tech', slug: 'speedbots', description: 'High-speed RC models & programmable robots' },
  });
  const brandBrainBlox = await prisma.brand.create({
    data: { name: 'BrainBlox India', slug: 'brainblox', description: 'STEM puzzles & modular building sets' },
  });
  const brandChannapatna = await prisma.brand.create({
    data: { name: 'Channapatna Heritage', slug: 'channapatna', description: 'Traditional non-toxic lacquered wooden toys' },
  });
  const brandPlayCraft = await prisma.brand.create({
    data: { name: 'PlayCraft Kids', slug: 'playcraft', description: 'Everyday creative play & action toys' },
  });

  // 6. Seed Suppliers
  console.log('🏭 Seeding Indian Toy Suppliers...');
  const supFunPlay = await prisma.supplier.create({
    data: {
      code: 'SUP-001',
      name: 'FunPlay Toys India Pvt Ltd',
      contactPerson: 'Vikram Seth',
      email: 'orders@funplaytoys.in',
      phone: '+91 22 2845 7788',
      address: 'Plot 18, MIDC Industrial Area, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400093',
      gstin: '27AABCF1234Q1Z5',
      pan: 'AABCF1234Q',
      leadTimeDays: 5,
      paymentTerms: 'NET_30',
      moq: 12,
      rating: 4.8,
    },
  });

  const supBharat = await prisma.supplier.create({
    data: {
      code: 'SUP-002',
      name: 'Bharat Games & Polymers',
      contactPerson: 'Rajesh Gupta',
      email: 'sales@bharatgames.co.in',
      phone: '+91 11 2733 9900',
      address: 'Sector 5, Bawana Industrial Area',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110039',
      gstin: '07AAACB9876C1ZT',
      pan: 'AAACB9876C',
      leadTimeDays: 7,
      paymentTerms: 'NET_15',
      moq: 20,
      rating: 4.5,
    },
  });

  const supToyCrafters = await prisma.supplier.create({
    data: {
      code: 'SUP-003',
      name: 'ToyCrafters Heritage Artisans',
      contactPerson: 'Shankar Gowda',
      email: 'info@toycrafters.org',
      phone: '+91 8232 251234',
      address: 'Crafts Cluster Road, Channapatna',
      city: 'Ramanagara',
      state: 'Karnataka',
      pincode: '562160',
      gstin: '29AAACT5544K1ZF',
      pan: 'AAACT5544K',
      leadTimeDays: 10,
      paymentTerms: 'ADVANCE',
      moq: 10,
      rating: 4.9,
    },
  });

  // 7. Seed Packaging Materials
  console.log('📦 Seeding Packaging Materials...');
  await prisma.packagingMaterial.createMany({
    data: [
      {
        code: 'BOX-S',
        name: 'Small Toy Shipper Box',
        type: 'BOX',
        lengthCm: 20.0,
        widthCm: 15.0,
        heightCm: 10.0,
        maxWeightCapacityGrams: 1500,
        unitCost: 18.0,
        stockQuantity: 450,
        reorderLevel: 50,
        reorderQty: 200,
      },
      {
        code: 'BOX-M',
        name: 'Medium Toy Shipper Box',
        type: 'BOX',
        lengthCm: 35.0,
        widthCm: 25.0,
        heightCm: 20.0,
        maxWeightCapacityGrams: 5000,
        unitCost: 32.0,
        stockQuantity: 320,
        reorderLevel: 40,
        reorderQty: 150,
      },
      {
        code: 'BOX-L',
        name: 'Large Playset Shipper Box',
        type: 'BOX',
        lengthCm: 50.0,
        widthCm: 40.0,
        heightCm: 30.0,
        maxWeightCapacityGrams: 12000,
        unitCost: 55.0,
        stockQuantity: 180,
        reorderLevel: 25,
        reorderQty: 100,
      },
      {
        code: 'POLY-01',
        name: 'Reinforced Poly Mailer Bag',
        type: 'MAILER_BAG',
        lengthCm: 30.0,
        widthCm: 25.0,
        heightCm: 2.0,
        maxWeightCapacityGrams: 800,
        unitCost: 8.0,
        stockQuantity: 800,
        reorderLevel: 100,
        reorderQty: 500,
      },
      {
        code: 'LABEL-4X6',
        name: 'Thermal Shipping Label 4x6 Roll',
        type: 'THERMAL_LABEL',
        lengthCm: 15.0,
        widthCm: 10.0,
        heightCm: 0.1,
        maxWeightCapacityGrams: 10,
        unitCost: 1.5,
        stockQuantity: 2500,
        reorderLevel: 300,
        reorderQty: 1000,
      },
    ],
  });

  // 8. Seed 30 Realistic Toy SKUs
  console.log('🧸 Seeding 30 Toy SKUs with Indian BIS and GST Compliance...');
  const toyData = [
    // RC & Vehicles
    {
      sku: 'TOY-RC-001',
      barcode: '8901234000018',
      name: 'SpeedBots 4WD Monster Rock Crawler 1:16',
      categoryId: catVehicles.id,
      brandId: brandSpeedBots.id,
      costPrice: 1250.0,
      sellingPrice: 2499.0,
      gstPercent: 18.0,
      hsnCode: '95030090',
      weightGrams: 850,
      lengthCm: 28,
      widthCm: 18,
      heightCm: 16,
      reorderLevel: 15,
      reorderQty: 40,
      bisCertNumber: 'CM/L-8400192',
      ageGroup: '6-8 Years',
      batteryRequired: true,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Non-toxic ABS Plastic & Alloy',
      supplierId: supFunPlay.id,
      supplierPrice: 1250.0,
    },
    {
      sku: 'TOY-RC-002',
      barcode: '8901234000025',
      name: 'SpeedBots Drift King RC Sports Car 2.4GHz',
      categoryId: catVehicles.id,
      brandId: brandSpeedBots.id,
      costPrice: 950.0,
      sellingPrice: 1899.0,
      gstPercent: 18.0,
      hsnCode: '95030090',
      weightGrams: 620,
      lengthCm: 25,
      widthCm: 12,
      heightCm: 9,
      reorderLevel: 20,
      reorderQty: 50,
      bisCertNumber: 'CM/L-8400192',
      ageGroup: '6-8 Years',
      batteryRequired: true,
      batteryIncluded: true,
      chokingHazardWarning: false,
      materialType: 'Polycarbonate & ABS',
      supplierId: supFunPlay.id,
      supplierPrice: 950.0,
    },
    {
      sku: 'TOY-DIE-003',
      barcode: '8901234000032',
      name: 'PlayCraft Die-Cast Vintage Indian Auto Rickshaw',
      categoryId: catVehicles.id,
      brandId: brandPlayCraft.id,
      costPrice: 180.0,
      sellingPrice: 449.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 160,
      lengthCm: 12,
      widthCm: 7,
      heightCm: 8,
      reorderLevel: 30,
      reorderQty: 100,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '3-6 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Die-cast Zinc Alloy',
      supplierId: supBharat.id,
      supplierPrice: 180.0,
    },
    {
      sku: 'TOY-DIE-004',
      barcode: '8901234000049',
      name: 'PlayCraft Supercar Die-Cast Set (5 Pack)',
      categoryId: catVehicles.id,
      brandId: brandPlayCraft.id,
      costPrice: 420.0,
      sellingPrice: 999.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 380,
      lengthCm: 24,
      widthCm: 11,
      heightCm: 4,
      reorderLevel: 25,
      reorderQty: 60,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '3-6 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Die-cast Metal & Eco Plastic',
      supplierId: supBharat.id,
      supplierPrice: 420.0,
    },

    // STEM & Robotics
    {
      sku: 'TOY-STEM-005',
      barcode: '8901234000056',
      name: 'SpeedBots 14-in-1 Solar Powered DIY Robot Kit',
      categoryId: catSTEM.id,
      brandId: brandSpeedBots.id,
      costPrice: 780.0,
      sellingPrice: 1649.0,
      gstPercent: 18.0,
      hsnCode: '95030090',
      weightGrams: 490,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 6,
      reorderLevel: 15,
      reorderQty: 40,
      bisCertNumber: 'CM/L-8400192',
      ageGroup: '8-12 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Solar Cell & High Grade Plastic',
      supplierId: supFunPlay.id,
      supplierPrice: 780.0,
    },
    {
      sku: 'TOY-STEM-006',
      barcode: '8901234000063',
      name: 'BrainBlox Electronic Circuits Playground (80 Projects)',
      categoryId: catSTEM.id,
      brandId: brandBrainBlox.id,
      costPrice: 1100.0,
      sellingPrice: 2299.0,
      gstPercent: 18.0,
      hsnCode: '95030090',
      weightGrams: 720,
      lengthCm: 38,
      widthCm: 26,
      heightCm: 5,
      reorderLevel: 12,
      reorderQty: 30,
      bisCertNumber: 'CM/L-6600981',
      ageGroup: '8-12 Years',
      batteryRequired: true,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Insulated Copper & ABS',
      supplierId: supFunPlay.id,
      supplierPrice: 1100.0,
    },
    {
      sku: 'TOY-STEM-007',
      barcode: '8901234000070',
      name: 'BrainBlox Coding Maze Logic Board Game',
      categoryId: catSTEM.id,
      brandId: brandBrainBlox.id,
      costPrice: 650.0,
      sellingPrice: 1399.0,
      gstPercent: 18.0,
      hsnCode: '95030030',
      weightGrams: 550,
      lengthCm: 28,
      widthCm: 24,
      heightCm: 6,
      reorderLevel: 15,
      reorderQty: 45,
      bisCertNumber: 'CM/L-6600981',
      ageGroup: '6-8 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Eco Plastic',
      supplierId: supBharat.id,
      supplierPrice: 650.0,
    },
    {
      sku: 'TOY-STEM-008',
      barcode: '8901234000087',
      name: 'BrainBlox Young Chemist 50 Safe Experiments Lab',
      categoryId: catSTEM.id,
      brandId: brandBrainBlox.id,
      costPrice: 520.0,
      sellingPrice: 1199.0,
      gstPercent: 18.0,
      hsnCode: '95030090',
      weightGrams: 640,
      lengthCm: 32,
      widthCm: 24,
      heightCm: 7,
      reorderLevel: 18,
      reorderQty: 50,
      bisCertNumber: 'CM/L-6600981',
      ageGroup: '8-12 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Food Grade Reagents & PP Plastic',
      supplierId: supBharat.id,
      supplierPrice: 520.0,
    },

    // Building Blocks & Sets
    {
      sku: 'TOY-BLK-009',
      barcode: '8901234000094',
      name: 'BrainBlox Space Explorer Rocket 650-Piece Set',
      categoryId: catBlocks.id,
      brandId: brandBrainBlox.id,
      costPrice: 890.0,
      sellingPrice: 1999.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 820,
      lengthCm: 36,
      widthCm: 28,
      heightCm: 7,
      reorderLevel: 20,
      reorderQty: 50,
      bisCertNumber: 'CM/L-6600981',
      ageGroup: '6-8 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Non-toxic ABS Plastic',
      supplierId: supBharat.id,
      supplierPrice: 890.0,
    },
    {
      sku: 'TOY-BLK-010',
      barcode: '8901234000100',
      name: 'BrainBlox Classic Colorful Bricks Tub (1000 Pcs)',
      categoryId: catBlocks.id,
      brandId: brandBrainBlox.id,
      costPrice: 950.0,
      sellingPrice: 2199.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 1450,
      lengthCm: 30,
      widthCm: 30,
      heightCm: 22,
      reorderLevel: 15,
      reorderQty: 40,
      bisCertNumber: 'CM/L-6600981',
      ageGroup: '3-6 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Virgin ABS Polymer',
      supplierId: supBharat.id,
      supplierPrice: 950.0,
    },
    {
      sku: 'TOY-BLK-011',
      barcode: '8901234000117',
      name: 'Channapatna Heritage 100 Natural Wooden Castle Blocks',
      categoryId: catBlocks.id,
      brandId: brandChannapatna.id,
      costPrice: 720.0,
      sellingPrice: 1699.0,
      gstPercent: 12.0, // Handcrafted wooden toy rate
      hsnCode: '95030020',
      weightGrams: 1600,
      lengthCm: 26,
      widthCm: 20,
      heightCm: 12,
      reorderLevel: 12,
      reorderQty: 30,
      bisCertNumber: 'CM/L-5500244',
      ageGroup: '1-3 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Wrightia Tinctoria Natural Wood',
      supplierId: supToyCrafters.id,
      supplierPrice: 720.0,
    },
    {
      sku: 'TOY-BLK-012',
      barcode: '8901234000124',
      name: 'BrainBlox Magnetic Tiles 3D Castle 64 Pcs',
      categoryId: catBlocks.id,
      brandId: brandBrainBlox.id,
      costPrice: 850.0,
      sellingPrice: 1899.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 1100,
      lengthCm: 28,
      widthCm: 22,
      heightCm: 8,
      reorderLevel: 25,
      reorderQty: 60,
      bisCertNumber: 'CM/L-6600981',
      ageGroup: '3-6 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Ultrasonic Sealed ABS & Neodymium',
      supplierId: supFunPlay.id,
      supplierPrice: 850.0,
    },

    // Board Games & Puzzles
    {
      sku: 'TOY-GAME-013',
      barcode: '8901234000131',
      name: 'PlayCraft Indian Empires Strategy Board Game',
      categoryId: catGames.id,
      brandId: brandPlayCraft.id,
      costPrice: 480.0,
      sellingPrice: 1199.0,
      gstPercent: 18.0,
      hsnCode: '95049090',
      weightGrams: 890,
      lengthCm: 32,
      widthCm: 32,
      heightCm: 6,
      reorderLevel: 20,
      reorderQty: 50,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '8-12 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Reinforced Cardboard & Wooden Pawns',
      supplierId: supBharat.id,
      supplierPrice: 480.0,
    },
    {
      sku: 'TOY-GAME-014',
      barcode: '8901234000148',
      name: 'Channapatna Handcrafted Lacquer Chess Set (12 Inch)',
      categoryId: catGames.id,
      brandId: brandChannapatna.id,
      costPrice: 950.0,
      sellingPrice: 2299.0,
      gstPercent: 12.0,
      hsnCode: '95049090',
      weightGrams: 1200,
      lengthCm: 32,
      widthCm: 32,
      heightCm: 5,
      reorderLevel: 10,
      reorderQty: 25,
      bisCertNumber: 'CM/L-5500244',
      ageGroup: '6-8 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Rosewood & Natural Lacquer Dye',
      supplierId: supToyCrafters.id,
      supplierPrice: 950.0,
    },
    {
      sku: 'TOY-GAME-015',
      barcode: '8901234000155',
      name: 'PlayCraft Monuments of India 500 Pcs Jigsaw Puzzle',
      categoryId: catGames.id,
      brandId: brandPlayCraft.id,
      costPrice: 240.0,
      sellingPrice: 599.0,
      gstPercent: 18.0,
      hsnCode: '95030030',
      weightGrams: 420,
      lengthCm: 25,
      widthCm: 20,
      heightCm: 4,
      reorderLevel: 30,
      reorderQty: 80,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '6-8 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Blue Board Recycled Pulp',
      supplierId: supBharat.id,
      supplierPrice: 240.0,
    },
    {
      sku: 'TOY-GAME-016',
      barcode: '8901234000162',
      name: 'PlayCraft WordMaster Crossword Word Battle',
      categoryId: catGames.id,
      brandId: brandPlayCraft.id,
      costPrice: 310.0,
      sellingPrice: 749.0,
      gstPercent: 18.0,
      hsnCode: '95049090',
      weightGrams: 510,
      lengthCm: 34,
      widthCm: 20,
      heightCm: 4,
      reorderLevel: 25,
      reorderQty: 60,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '8-12 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Molded Plastic Tiles & Board',
      supplierId: supBharat.id,
      supplierPrice: 310.0,
    },

    // Infant & Toddler Toys
    {
      sku: 'TOY-INF-017',
      barcode: '8901234000179',
      name: 'Channapatna Organic Vegetable Dye Rattle Set (3 Pcs)',
      categoryId: catInfant.id,
      brandId: brandChannapatna.id,
      costPrice: 350.0,
      sellingPrice: 849.0,
      gstPercent: 12.0,
      hsnCode: '95030020',
      weightGrams: 280,
      lengthCm: 18,
      widthCm: 14,
      heightCm: 6,
      reorderLevel: 20,
      reorderQty: 50,
      bisCertNumber: 'CM/L-5500244',
      ageGroup: '0-6 Months',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Ivory Wood & Turmeric/Indigo Dyes',
      supplierId: supToyCrafters.id,
      supplierPrice: 350.0,
    },
    {
      sku: 'TOY-INF-018',
      barcode: '8901234000186',
      name: 'Channapatna Traditional Wooden Push Walker with Beads',
      categoryId: catInfant.id,
      brandId: brandChannapatna.id,
      costPrice: 890.0,
      sellingPrice: 2199.0,
      gstPercent: 12.0,
      hsnCode: '95030020',
      weightGrams: 2400,
      lengthCm: 45,
      widthCm: 32,
      heightCm: 40,
      reorderLevel: 10,
      reorderQty: 25,
      bisCertNumber: 'CM/L-5500244',
      ageGroup: '6-12 Months',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Solid Natural Timber',
      supplierId: supToyCrafters.id,
      supplierPrice: 890.0,
    },
    {
      sku: 'TOY-INF-019',
      barcode: '8901234000193',
      name: 'PlayCraft 8-Key Rainbow Musical Xylophone with Mallets',
      categoryId: catInfant.id,
      brandId: brandPlayCraft.id,
      costPrice: 280.0,
      sellingPrice: 699.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 390,
      lengthCm: 25,
      widthCm: 14,
      heightCm: 5,
      reorderLevel: 25,
      reorderQty: 60,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '1-3 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Aluminum Keys & Non-toxic Wood Base',
      supplierId: supFunPlay.id,
      supplierPrice: 280.0,
    },
    {
      sku: 'TOY-INF-020',
      barcode: '8901234000209',
      name: 'PlayCraft Silicone Teething & Stacking Rings (6 Pcs)',
      categoryId: catInfant.id,
      brandId: brandPlayCraft.id,
      costPrice: 210.0,
      sellingPrice: 499.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 210,
      lengthCm: 12,
      widthCm: 12,
      heightCm: 15,
      reorderLevel: 30,
      reorderQty: 80,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '0-6 Months',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: '100% Food Grade Silicone BPA Free',
      supplierId: supFunPlay.id,
      supplierPrice: 210.0,
    },

    // Action Figures & Dolls
    {
      sku: 'TOY-ACT-021',
      barcode: '8901234000216',
      name: 'PlayCraft Mythic Hero Hanuman Action Figure 12 Inch',
      categoryId: catAction.id,
      brandId: brandPlayCraft.id,
      costPrice: 420.0,
      sellingPrice: 999.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 360,
      lengthCm: 32,
      widthCm: 16,
      heightCm: 8,
      reorderLevel: 20,
      reorderQty: 50,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '3-6 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Molded PVC & Articulated Joints',
      supplierId: supBharat.id,
      supplierPrice: 420.0,
    },
    {
      sku: 'TOY-ACT-022',
      barcode: '8901234000223',
      name: 'PlayCraft Roaring T-Rex Dinosaur with Sound & Lights',
      categoryId: catAction.id,
      brandId: brandPlayCraft.id,
      costPrice: 610.0,
      sellingPrice: 1399.0,
      gstPercent: 18.0,
      hsnCode: '95030090',
      weightGrams: 580,
      lengthCm: 36,
      widthCm: 14,
      heightCm: 22,
      reorderLevel: 15,
      reorderQty: 40,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '3-6 Years',
      batteryRequired: true,
      batteryIncluded: true,
      chokingHazardWarning: false,
      materialType: 'Soft Textured Polymer & ABS',
      supplierId: supFunPlay.id,
      supplierPrice: 610.0,
    },
    {
      sku: 'TOY-ACT-023',
      barcode: '8901234000230',
      name: 'PlayCraft Indian Traditional Bride Fashion Doll 30cm',
      categoryId: catAction.id,
      brandId: brandPlayCraft.id,
      costPrice: 380.0,
      sellingPrice: 899.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 320,
      lengthCm: 32,
      widthCm: 18,
      heightCm: 6,
      reorderLevel: 20,
      reorderQty: 50,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '3-6 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Vinyl & Silk Brocade Fabric',
      supplierId: supBharat.id,
      supplierPrice: 380.0,
    },
    {
      sku: 'TOY-ACT-024',
      barcode: '8901234000247',
      name: 'PlayCraft Space Ranger Robotic Cyborg with Blaster',
      categoryId: catAction.id,
      brandId: brandPlayCraft.id,
      costPrice: 490.0,
      sellingPrice: 1149.0,
      gstPercent: 18.0,
      hsnCode: '95030090',
      weightGrams: 410,
      lengthCm: 28,
      widthCm: 16,
      heightCm: 8,
      reorderLevel: 18,
      reorderQty: 45,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '6-8 Years',
      batteryRequired: true,
      batteryIncluded: true,
      chokingHazardWarning: true,
      materialType: 'ABS Plastic with LED Effects',
      supplierId: supFunPlay.id,
      supplierPrice: 490.0,
    },

    // Arts, Crafts & Modeling
    {
      sku: 'TOY-ART-025',
      barcode: '8901234000254',
      name: 'PlayCraft 12-Color Scented Dough Bucket with Molds',
      categoryId: catSTEM.id,
      brandId: brandPlayCraft.id,
      costPrice: 220.0,
      sellingPrice: 549.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 750,
      lengthCm: 18,
      widthCm: 18,
      heightCm: 16,
      reorderLevel: 30,
      reorderQty: 80,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '3-6 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Wheat Flour Non-toxic Colored Dough',
      supplierId: supBharat.id,
      supplierPrice: 220.0,
    },
    {
      sku: 'TOY-ART-026',
      barcode: '8901234000261',
      name: 'PlayCraft Pottery Wheel Craft Studio for Kids',
      categoryId: catSTEM.id,
      brandId: brandPlayCraft.id,
      costPrice: 650.0,
      sellingPrice: 1499.0,
      gstPercent: 18.0,
      hsnCode: '95030090',
      weightGrams: 1150,
      lengthCm: 34,
      widthCm: 26,
      heightCm: 9,
      reorderLevel: 15,
      reorderQty: 35,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '8-12 Years',
      batteryRequired: true,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Electric Motor & Natural Terracotta Clay',
      supplierId: supFunPlay.id,
      supplierPrice: 650.0,
    },
    {
      sku: 'TOY-ART-027',
      barcode: '8901234000278',
      name: 'PlayCraft SandMagic Kinetic Sensory Sand (1kg + Sandbox)',
      categoryId: catSTEM.id,
      brandId: brandPlayCraft.id,
      costPrice: 320.0,
      sellingPrice: 799.0,
      gstPercent: 18.0,
      hsnCode: '95030010',
      weightGrams: 1200,
      lengthCm: 25,
      widthCm: 20,
      heightCm: 8,
      reorderLevel: 25,
      reorderQty: 60,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '3-6 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Coated Quartz Sand & Silicone Binder',
      supplierId: supBharat.id,
      supplierPrice: 320.0,
    },
    {
      sku: 'TOY-ART-028',
      barcode: '8901234000285',
      name: 'PlayCraft DIY Wooden Solar System Hanging Mobile',
      categoryId: catSTEM.id,
      brandId: brandPlayCraft.id,
      costPrice: 280.0,
      sellingPrice: 649.0,
      gstPercent: 12.0,
      hsnCode: '95030020',
      weightGrams: 310,
      lengthCm: 24,
      widthCm: 18,
      heightCm: 4,
      reorderLevel: 20,
      reorderQty: 50,
      bisCertNumber: 'CM/L-7200015',
      ageGroup: '6-8 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: true,
      materialType: 'Laser Cut Birch Plywood & Paints',
      supplierId: supToyCrafters.id,
      supplierPrice: 280.0,
    },

    // Additional high movers
    {
      sku: 'TOY-RC-029',
      barcode: '8901234000292',
      name: 'SpeedBots SkyPhantom Altitude Hold RC Drone with HD Camera',
      categoryId: catVehicles.id,
      brandId: brandSpeedBots.id,
      costPrice: 1850.0,
      sellingPrice: 3999.0,
      gstPercent: 18.0,
      hsnCode: '95030090',
      weightGrams: 390,
      lengthCm: 22,
      widthCm: 22,
      heightCm: 7,
      reorderLevel: 10,
      reorderQty: 25,
      bisCertNumber: 'CM/L-8400192',
      ageGroup: '12+ Years',
      batteryRequired: true,
      batteryIncluded: true,
      chokingHazardWarning: true,
      materialType: 'Carbon Fiber Arms & High Resilience Body',
      supplierId: supFunPlay.id,
      supplierPrice: 1850.0,
    },
    {
      sku: 'TOY-BLK-030',
      barcode: '8901234000308',
      name: 'Channapatna Multicolored Stacking Ring Pyramid (Non-Toxic)',
      categoryId: catInfant.id,
      brandId: brandChannapatna.id,
      costPrice: 260.0,
      sellingPrice: 599.0,
      gstPercent: 12.0,
      hsnCode: '95030020',
      weightGrams: 350,
      lengthCm: 12,
      widthCm: 12,
      heightCm: 18,
      reorderLevel: 30,
      reorderQty: 75,
      bisCertNumber: 'CM/L-5500244',
      ageGroup: '1-3 Years',
      batteryRequired: false,
      batteryIncluded: false,
      chokingHazardWarning: false,
      materialType: 'Wrightia Tinctoria Wood with Natural Wax Polish',
      supplierId: supToyCrafters.id,
      supplierPrice: 260.0,
    },
  ];

  const createdProducts: any[] = [];
  for (const item of toyData) {
    const p = await prisma.product.create({
      data: {
        sku: item.sku,
        barcode: item.barcode,
        name: item.name,
        categoryId: item.categoryId,
        brandId: item.brandId,
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        gstPercent: item.gstPercent,
        hsnCode: item.hsnCode,
        weightGrams: item.weightGrams,
        lengthCm: item.lengthCm,
        widthCm: item.widthCm,
        heightCm: item.heightCm,
        reorderLevel: item.reorderLevel,
        reorderQty: item.reorderQty,
        bisCertNumber: item.bisCertNumber,
        ageGroup: item.ageGroup,
        batteryRequired: item.batteryRequired,
        batteryIncluded: item.batteryIncluded,
        chokingHazardWarning: item.chokingHazardWarning,
        materialType: item.materialType,
        images: [`https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&auto=format&fit=crop&q=60`],
      },
    });

    createdProducts.push(p);

    // Link Supplier Pricing
    await prisma.supplierProductPrice.create({
      data: {
        supplierId: item.supplierId,
        productId: p.id,
        unitPrice: item.supplierPrice,
        moq: 10,
        leadTimeDays: 7,
        isPrimary: true,
      },
    });
  }

  // 9. Seed Stock Levels & Initial Inventory Ledger
  console.log('📊 Seeding Initial Stock in Buckets & Immutable Ledger...');
  const storageLocations = Array.from(locationsMap.values()).filter((l) => l.type === LocationType.STORAGE);
  const pickingLocations = Array.from(locationsMap.values()).filter((l) => l.type === LocationType.PICKING);
  const damagedLoc = Array.from(locationsMap.values()).find((l) => l.type === LocationType.DAMAGED)!;
  const returnsLoc = Array.from(locationsMap.values()).find((l) => l.type === LocationType.RETURNS)!;

  for (let i = 0; i < createdProducts.length; i++) {
    const prod = createdProducts[i];
    const pickLoc = pickingLocations[i % pickingLocations.length];
    const storeLoc = storageLocations[i % storageLocations.length];

    const pickQty = 25 + (i % 15);
    const storeQty = 60 + (i % 30);
    const damagedQty = i % 5 === 0 ? 2 : 0;
    const returnQty = i % 7 === 0 ? 3 : 0;

    // Picking location stock
    await prisma.stockLevel.create({
      data: {
        warehouseId: warehouse.id,
        locationId: pickLoc.id,
        productId: prod.id,
        onHand: pickQty,
        reserved: 0,
      },
    });

    // Storage location stock
    await prisma.stockLevel.create({
      data: {
        warehouseId: warehouse.id,
        locationId: storeLoc.id,
        productId: prod.id,
        onHand: storeQty,
        reserved: 0,
      },
    });

    // Write initial immutable ledger entries
    await prisma.inventoryLedger.create({
      data: {
        productId: prod.id,
        toLocationId: pickLoc.id,
        movementType: MovementType.PO_RECEIVE,
        quantity: pickQty,
        beforeOnHand: 0,
        afterOnHand: pickQty,
        beforeReserved: 0,
        afterReserved: 0,
        referenceType: ReferenceDocType.PURCHASE_ORDER,
        referenceId: 'PO-INIT-2026',
        reason: 'Initial warehouse intake stock',
        performedById: adminUser.id,
      },
    });

    await prisma.inventoryLedger.create({
      data: {
        productId: prod.id,
        toLocationId: storeLoc.id,
        movementType: MovementType.PO_RECEIVE,
        quantity: storeQty,
        beforeOnHand: 0,
        afterOnHand: storeQty,
        beforeReserved: 0,
        afterReserved: 0,
        referenceType: ReferenceDocType.PURCHASE_ORDER,
        referenceId: 'PO-INIT-2026',
        reason: 'Bulk storage intake stock',
        performedById: adminUser.id,
      },
    });

    // Damaged bucket if any
    if (damagedQty > 0) {
      await prisma.stockLevel.create({
        data: {
          warehouseId: warehouse.id,
          locationId: damagedLoc.id,
          productId: prod.id,
          onHand: damagedQty,
          damaged: damagedQty,
        },
      });

      await prisma.inventoryLedger.create({
        data: {
          productId: prod.id,
          toLocationId: damagedLoc.id,
          movementType: MovementType.DAMAGE_TRANSFER,
          quantity: damagedQty,
          beforeOnHand: 0,
          afterOnHand: damagedQty,
          beforeReserved: 0,
          afterReserved: 0,
          referenceType: ReferenceDocType.STOCK_ADJUSTMENT,
          referenceId: 'ADJ-DMG-001',
          reason: 'Defective carton from supplier transit',
          performedById: qcUser.id,
        },
      });
    }

    // Returns bucket if any
    if (returnQty > 0) {
      await prisma.stockLevel.create({
        data: {
          warehouseId: warehouse.id,
          locationId: returnsLoc.id,
          productId: prod.id,
          onHand: returnQty,
          returned: returnQty,
        },
      });
    }
  }

  // 10. Seed Sample Purchase Order & GRN
  console.log('📋 Seeding Sample Purchase Order & GRN...');
  const samplePO = await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2026-0001',
      warehouseId: warehouse.id,
      supplierId: supFunPlay.id,
      status: 'SENT',
      expectedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      subtotal: 50000.0,
      taxAmount: 9000.0,
      totalAmount: 59000.0,
      createdById: managerUser.id,
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            expectedQty: 20,
            unitPrice: 1250.0,
            gstPercent: 18.0,
            taxAmount: 4500.0,
            totalPrice: 29500.0,
          },
          {
            productId: createdProducts[1].id,
            expectedQty: 25,
            unitPrice: 950.0,
            gstPercent: 18.0,
            taxAmount: 4275.0,
            totalPrice: 28025.0,
          },
        ],
      },
    },
  });

  // 11. Seed Initial Audit Logs
  console.log('📝 Seeding Initial Audit Logs...');
  await prisma.auditLog.createMany({
    data: [
      {
        userId: adminUser.id,
        userEmail: adminUser.email,
        userRole: adminUser.role,
        action: 'SYSTEM_INITIALIZATION',
        entityType: 'Warehouse',
        entityId: warehouse.id,
        details: { message: 'Warehouse BLR-TOY-DC-01 initialized with 42 locations' },
      },
      {
        userId: managerUser.id,
        userEmail: managerUser.email,
        userRole: managerUser.role,
        action: 'PURCHASE_ORDER_SENT',
        entityType: 'PurchaseOrder',
        entityId: samplePO.id,
        details: { poNumber: samplePO.poNumber, supplier: 'FunPlay Toys India Pvt Ltd' },
      },
    ],
  });

  console.log('✅ Seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Warehouse: ' + warehouse.name + ' (' + warehouse.code + ')');
  console.log('Locations: 42 locations created across all types');
  console.log('Products : 30 Toy SKUs seeded with BIS & GST compliance');
  console.log('Suppliers: 3 Indian Toy suppliers seeded');
  console.log('Users    :');
  console.log('  - ADMIN               : admin@toywms.in / Password@123');
  console.log('  - WAREHOUSE_MANAGER   : manager@toywms.in / Password@123');
  console.log('  - WAREHOUSE_ASSOCIATE : worker@toywms.in / Password@123');
  console.log('  - QC                  : qc@toywms.in / Password@123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
