import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import Home from "../screens/Home";
import RecordScreen from "../screens/RecordScreen";
import Profile from "../screens/Profile";

const TrailsRoute = () => <Home />;

const RecordRoute = () => <RecordScreen />;

const ProfileRoute = () => <Profile />

export default BottomNavComponent = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "trails", title: "Trails", focusedIcon: "map" },
    { key: "record", title: "Record", focusedIcon: "record-circle-outline" },
    { key: "profile", title: "Profile", focusedIcon: "account"}
  ]);

  const renderScene = BottomNavigation.SceneMap({
    trails: TrailsRoute,
    record: RecordRoute,
    profile: ProfileRoute
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};
