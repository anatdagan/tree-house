import { UserProvider } from "./context/UserContext.tsx";
import { lazy, Suspense } from "react";
import LoadingIndicator from "./ui/LoadingIndicator.tsx";
const ChatMessagesContainer = lazy(
  () => import("./components/chat/ChatMessagesContainer.tsx")
);

const Chat = lazy(() => import("./components/chat/Chat.tsx"));
const ChatHeader = lazy(() => import("./components/chat/ChatHeader.tsx"));
const ChatFooter = lazy(() => import("./components/chat/ChatFooter.tsx"));

function App() {
  return (
    <UserProvider>
      <Suspense fallback={<LoadingIndicator />}>
        <Chat>
          <ChatHeader />
          <ChatMessagesContainer />
          <ChatFooter></ChatFooter>
        </Chat>
      </Suspense>
    </UserProvider>
  );
}
export default App;
