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
      path: "/:id",
      name: "monitor",
      component: Monitor,
      props: (route) => ({ id: parseInt(route.params.id as string) }),
    },
  ],
});

export default router;
