import { useSuperchatStore } from "@/stores";
import { resolveSuperChat } from "@/api";

import e from "@/api/blive/test_data/sc.json";

export function useTestSuperChat() {
  const scStore = useSuperchatStore();

  scStore.add(resolveSuperChat(e));
}
