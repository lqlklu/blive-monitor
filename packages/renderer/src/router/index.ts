import { createRouter, createWebHashHistory } from "vue-router";
import Welcome from "@/components/Welcome.vue";
import Monitor from "@/components/Monitor.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "welcome",
      component: Welcome,
    },
    {
      path: "/monitor",
      name: "monitor",
      component: Monitor,
      props: (route) => ({ id: parseInt(route.query.room as string) }),
    },
  ],
});

export default router;
