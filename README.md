# Treehouse Chat App

## Description

Treehouse Chat App is a child-safe chat application that allows kids to develop social skills in a safe and friendly environment. The children are then encouraged to meet the friends that they've made in the real world as well.

## Installation

To run this app locally, follow these steps:

1. Clone the repository.
2. Navigate to the root folder (`tree-house`).
3. Run `npm install` to install the dependencies.
4. Start the emulators after importing them from `./emulatorsbk`.
5. Run `npm run dev` in the terminal to start the application.

## Usage

- Only children registered by their parents (using the Treehouse parents dashboard, a different project) are allowed to use the app.
- After logging in, children can chat with others in the main chat room, invite children to private chats by clicking on their avatars, and chat with AI-powered chat counselors Jimmy and Minnie.
- New users enter the "welcome" room where Jimmy and Minnie explain the application.
- Children can mention Jimmy or Minnie (with @ prefix) to ask questions or add them to a chat room by clicking on their avatars.
- A bell icon in the header opens the inbox. A red circle indicates new notifications.
- Offensive and inappropriate messages are blocked. Messages exposing the child's full identity are also blocked, and a counselor then explains to the child about web safety.
- If a child shows signs of depression, their parent receives a notification. If a child shows signs of boredom, a counselor joins the chatroom to entertain them.
- Children are encouraged to ask a counselor to introduce their parent to the parent of their new friends for arranging real-world meetings.

## Prerequisites

- This app is developed primarily for Chrome browser. It also works well on Edge but not on Android browser.
- It utilizes Firebase, so you need to install the Firebase CLI.
