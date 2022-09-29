import { onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";

import { useDanmuStore } from "@/stores/danmu";

export function useRxLength(ul: Ref<Element | null>) {
  const danmuStore = useDanmuStore();
  const onResize = () => {
    const ulH = ul.value?.children[0].clientHeight || 1;
    const liH = ul.value?.children[0].children[0].clientHeight || 1;
    const size = Math.floor(ulH / liH);
    // console.log("resize", size);
    danmuStore.setYMax(size);
  };
  onMounted(() => {
    onResize();
    window.addEventListener("resize", onResize);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", onResize);
  });
}
