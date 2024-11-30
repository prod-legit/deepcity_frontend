import { useLocalStorage } from "@vueuse/core";
export default () => {
    const saved = useLocalStorage("saved_gj", () => undefined);
    console.log(saved.value);
    return saved.value
        ? saved.value
        : {
              type: "FeatureCollection",
              features: [
                  {
                      type: "Feature",
                      geometry: {
                          type: "LineString",
                          coordinates: [
                              [-75, 40, -500],
                              [-75, 40.1, -500],
                              [-75.1, 40.1, -509],
                          ],
                      },
                      properties: {
                          typeofpipe: "hot",
                          radius: 7,
                          depth: 5,
                          date_last_fix: "2024-01-02",
                          date_need_fix: "2025-10-17",
                          material: "Стальная",
                          status: "Используется",
                          comment:
                              "я короч изолентой замотал, надеюсь не прорвет",
                          color: "red",
                          meter_radius: 2000,
                      },
                  },
              ],
          };
};
