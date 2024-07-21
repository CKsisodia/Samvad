import { useAppSelector } from "../../hooks/reduxHooks";
import { selectedGroupID } from "../../redux/reducers/chatSlice";
import GroupMessages from "./GroupMessages";
import GroupTabs from "./GroupTabs";

const GroupChats = () => {
  const groupID =
    useAppSelector(selectedGroupID) ||
    JSON.parse(localStorage.getItem("selectedGroupID") || "null");

  return (
    <>
      {groupID !== null ? (
        <>
          <GroupTabs />
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "24%" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            Select a group to start chatting or to view the group.
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChats;
