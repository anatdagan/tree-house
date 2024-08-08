import { UserProvider } from "./context/UserContext.tsx";
import { lazy, Suspense } from "react";
import LoadingIndicator from "./ui/LoadingIndicator.tsx";
import ChatSubHeader from "./components/chat/ChatSubHeader.tsx";
const ChatMessagesContainer = lazy(
  () => import("./components/chat/ChatMessagesContainer.tsx")
);

const Chat = lazy(() => import("./components/chat/Chat.tsx"));
const ChatHeader = lazy(() => import("./components/chat/ChatHeader.tsx"));

function App() {
  return (
    <UserProvider>
      <Suspense fallback={<LoadingIndicator />}>
        <Chat>
          <ChatHeader />
          <ChatSubHeader />
          <ChatMessagesContainer />
        </Chat>
      </Suspense>
    </UserProvider>
  );
}
export default App;
