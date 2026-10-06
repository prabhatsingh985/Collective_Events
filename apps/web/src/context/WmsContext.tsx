'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  Location,
  PurchaseOrder,
  Order,
  PickTask,
  PackageMaterial,
  StockAlert,
  AuditRecord,
} from '../lib/types';
import {
  DEMO_USERS,
  DEMO_PRODUCTS,
  DEMO_LOCATIONS,
  DEMO_PURCHASE_ORDERS,
  DEMO_ORDERS,
  DEMO_PICK_TASKS,
  DEMO_PACKAGING,
  DEMO_ALERTS,
  DEMO_AUDIT_LOGS,
} from '../lib/demo-data';

interface WmsContextType {
  currentUser: User;
  switchUser: (role: string) => void;
  products: Product[];
  locations: Location[];
  purchaseOrders: PurchaseOrder[];
  orders: Order[];
  pickTasks: PickTask[];
  packaging: PackageMaterial[];
  alerts: StockAlert[];
  auditLogs: AuditRecord[];
  // Actions
  transferStock: (sku: string, fromLoc: string, toLoc: string, qty: number) => { success: boolean; message: string };
  adjustStock: (sku: string, qtyDelta: number, reason: string) => { success: boolean; message: string };
  confirmPickTask: (taskId: string, scannedProductBarcode: string, scannedLocBarcode: string) => { success: boolean; message: string };
  packAndShipOrder: (orderId: string, boxCode: string, courierName: string) => { success: boolean; awb: string; message: string };
  receiveGRN: (poId: string, acceptedQty: number, rejectedQty: number) => { success: boolean; message: string };
  triageReturn: (orderId: string, action: 'RESTOCK' | 'SCRAP') => { success: boolean; message: string };
  dismissAlert: (alertId: string) => void;
}

const WmsContext = createContext<WmsContextType | undefined>(undefined);

export function WmsProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]);
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [locations, setLocations] = useState<Location[]>(DEMO_LOCATIONS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(DEMO_PURCHASE_ORDERS);
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [pickTasks, setPickTasks] = useState<PickTask[]>(DEMO_PICK_TASKS);
  const [packaging] = useState<PackageMaterial[]>(DEMO_PACKAGING);
  const [alerts, setAlerts] = useState<StockAlert[]>(DEMO_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(DEMO_AUDIT_LOGS);

  const switchUser = (role: string) => {
    const found = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUser(found);
  };

  const addAuditLog = (action: string, entityType: string, entityId: string, details: string) => {
    const newLog: AuditRecord = {
      id: `aud-${Date.now()}`,
      action,
      entityType,
      entityId,
      userName: currentUser.name,
      userRole: currentUser.role,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const transferStock = (sku: string, fromLoc: string, toLoc: string, qty: number) => {
    const product = products.find((p) => p.sku === sku);
    if (!product) return { success: false, message: `SKU ${sku} not found` };
    if (product.available < qty) {
      return { success: false, message: `Insufficient available stock (${product.available} units on hand)` };
    }

    addAuditLog(
      'STOCK_TRANSFER',
      'INVENTORY',
      sku,
      `Transferred ${qty} units of ${sku} from ${fromLoc} to ${toLoc}`
    );

    return { success: true, message: `Successfully transferred ${qty} units to ${toLoc}` };
  };

  const adjustStock = (sku: string, qtyDelta: number, reason: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.sku === sku) {
          const newOnHand = Math.max(0, p.onHand + qtyDelta);
          const newAvailable = Math.max(0, p.available + qtyDelta);
          return { ...p, onHand: newOnHand, available: newAvailable };
        }
        return p;
      })
    );

    addAuditLog(
      'STOCK_ADJUSTMENT',
      'INVENTORY',
      sku,
      `Stock adjusted by ${qtyDelta > 0 ? '+' : ''}${qtyDelta} units. Reason: ${reason}`
    );

    return { success: true, message: `Adjusted stock for ${sku} successfully` };
  };

  const confirmPickTask = (taskId: string, scannedProductBarcode: string, scannedLocBarcode: string) => {
    const task = pickTasks.find((t) => t.id === taskId);
    if (!task) return { success: false, message: 'Pick task not found' };

    const product = products.find((p) => p.sku === task.sku);
    if (!product) return { success: false, message: 'Associated SKU not found' };

    // Barcode verification checks
    if (scannedProductBarcode.trim() !== product.barcode) {
      return {
        success: false,
        message: `Product barcode mismatch! Expected ${product.barcode} (${product.sku}), scanned: "${scannedProductBarcode}"`,
      };
    }

    if (!scannedLocBarcode.toUpperCase().includes(task.locationCode.replace(/-/g, '')) &&
        scannedLocBarcode.toUpperCase() !== task.locationCode) {
      return {
        success: false,
        message: `Location barcode mismatch! Expected bin ${task.locationCode}, scanned: "${scannedLocBarcode}"`,
      };
    }

    // Mark task as PICKED
    setPickTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'PICKED' } : t))
    );

    // Update order status if all tasks done
    setOrders((prev) =>
      prev.map((ord) => (ord.id === task.orderId ? { ...ord, status: 'PICKED' } : ord))
    );

    addAuditLog(
      'PICK_VERIFIED',
      'PICK_TASK',
      task.sku,
      `Verified barcode pick of ${task.quantity} units for Order #${task.orderNumber} at bin ${task.locationCode}`
    );

    return { success: true, message: `Pick confirmed for ${product.name}` };
  };

  const packAndShipOrder = (orderId: string, boxCode: string, courierName: string) => {
    const awb = `${courierName.includes('BlueDart') ? 'BD' : 'DEL'}-${Math.floor(100000000 + Math.random() * 900000000)}`;

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'SHIPPED',
              courier: courierName,
              awbNumber: awb,
            }
          : ord
      )
    );

    addAuditLog(
      'DISPATCH_AWB',
      'SHIPMENT',
      awb,
      `Packed in ${boxCode} and dispatched via ${courierName} with AWB #${awb}`
    );

    return { success: true, awb, message: `Dispatched order with AWB #${awb}` };
  };

  const receiveGRN = (poId: string, acceptedQty: number, rejectedQty: number) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === poId ? { ...po, status: 'RECEIVED' } : po))
    );

    addAuditLog(
      'GRN_RECEIVE_QC',
      'GRN',
      poId,
      `Received goods for PO. QC passed: ${acceptedQty} units. QC rejected: ${rejectedQty} units.`
    );

    return { success: true, message: `Goods Receipt Note created and stock updated.` };
  };

  const triageReturn = (orderId: string, action: 'RESTOCK' | 'SCRAP') => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: action === 'RESTOCK' ? 'DELIVERED' : 'CANCELLED' } : o))
    );

    addAuditLog(
      'RETURN_TRIAGE',
      'RETURNS',
      orderId,
      `Processed return triage: ${action === 'RESTOCK' ? 'Restocked to available inventory' : 'Scrapped to quarantine'}`
    );

    return { success: true, message: `Return triage complete (${action})` };
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  return (
    <WmsContext.Provider
      value={{
        currentUser,
        switchUser,
        products,
        locations,
        purchaseOrders,
        orders,
        pickTasks,
        packaging,
        alerts,
        auditLogs,
        transferStock,
        adjustStock,
        confirmPickTask,
        packAndShipOrder,
        receiveGRN,
        triageReturn,
        dismissAlert,
      }}
    >
      {children}
    </WmsContext.Provider>
  );
}

export function useWms() {
  const context = useContext(WmsContext);
  if (!context) {
    throw new Error('useWms must be used within a WmsProvider');
  }
  return context;
}
