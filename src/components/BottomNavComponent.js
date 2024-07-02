import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import Home from "../screens/Home";
import RecordScreen from "../screens/RecordScreen";

const TrailsRoute = () => <Home />;

const RecordRoute = () => <RecordScreen />;

export default BottomNavComponent = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "trails", title: "Trails", focusedIcon: "map" },
    { key: "record", title: "Record", focusedIcon: "record-circle-outline" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    trails: TrailsRoute,
    record: RecordRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};
