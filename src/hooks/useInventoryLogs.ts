import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  change: number;
  previousQty: number;
  newQty: number;
  reason: string;
  userId: string;
  userEmail: string;
  timestamp: any;
}

export const useInventoryLogs = (limitCount: number = 50) => {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "inventory_logs"),
      orderBy("timestamp", "desc"),
      limit(limitCount),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryLog[];
      setLogs(logList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limitCount]);

  return { logs, loading };
};
