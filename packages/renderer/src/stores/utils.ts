import type { Ref } from "vue";
import { useLocalStorage as useLs } from "@vueuse/core";

export const useLocalStorage = <T>(id: string, defaultValue: T): Ref<T> => useLs(id, defaultValue);
