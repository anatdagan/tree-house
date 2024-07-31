import { UserProvider } from "./context/UserContext.tsx";
import { lazy } from "react";
import ChatMessagesContainer from "./components/chat/ChatMessagesContainer.tsx";

const Chat = lazy(() => import("./components/chat/Chat.tsx"));
const ChatHeader = lazy(() => import("./components/chat/ChatHeader.tsx"));
const ChatFooter = lazy(() => import("./components/chat/ChatFooter.tsx"));

function App() {
  return (
    <UserProvider>
      <Chat>
        <ChatHeader />
        <ChatMessagesContainer />
        <ChatFooter></ChatFooter>
      </Chat>
    </UserProvider>
  );
}
export default App;
