import "./App.css";
import Chat from "./features/chat/Chat.tsx";
import ChatHeader from "./features/chat/ChatHeader.tsx";
import ChatMessages from "./features/chat/ChatMessages.tsx";
import ChatFooter from "./features/chat/ChatFooter.tsx";
import ChatNewMessage from "./features/chat/ChatNewMessage.tsx";
import { ChatProvider } from "./contexts/ChatContext.tsx";

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
