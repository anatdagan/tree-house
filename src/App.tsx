import { ChatProvider } from "./contexts/ChatContext.tsx";
import { lazy } from "react";

const Chat = lazy(() => import("./features/chat/Chat.tsx"));
const ChatHeader = lazy(() => import("./features/chat/ChatHeader.tsx"));
const ChatMessages = lazy(() => import("./features/chat/ChatMessages.tsx"));
const ChatFooter = lazy(() => import("./features/chat/ChatFooter.tsx"));
const ChatNewMessage = lazy(() => import("./features/chat/ChatNewMessage.tsx"));

function App() {
  return (
    <ChatProvider>
      <Chat>
        <ChatHeader />
        <ChatMessages />
        <ChatFooter>
          <ChatNewMessage />
        </ChatFooter>
      </Chat>
    </ChatProvider>
  );
}
export default App;
