import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import Home from "../screens/Home";
import RecordScreen from "../screens/RecordScreen";
import Profile from "../screens/Profile";


export default BottomNavComponent = () => {
  const [index, setIndex] = useState(0);
  const [refreshWalkList, setRefreshWalkList] = useState(false)
  const TrailsRoute = () => <Home refreshWalkList={refreshWalkList} />;
  const RecordRoute = () => <RecordScreen setRefreshWalkList={setRefreshWalkList} />;
  const ProfileRoute = () => <Profile />;
  const [routes] = useState([
    { key: "trails", title: "Trails", focusedIcon: "map" },
    { key: "record", title: "Record", focusedIcon: "record-circle-outline" },
    { key: "profile", title: "Profile", focusedIcon: "account" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    trails: TrailsRoute,
    record: RecordRoute,
    profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};
