import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import socket from "../socket";

import { AuthContext }
from "../context/AuthContext";

import {
  FaPaperPlane,
  FaSmile,
} from "react-icons/fa";

import EmojiPicker
from "emoji-picker-react";

import notificationSound
from "../assets/notification.mp3";

function Chat() {

  const { user } =
    useContext(AuthContext);

  // USERS

  const [users, setUsers] =
    useState([]);

  const [selectedUser,
    setSelectedUser] =
    useState(null);

  // GROUPS

  const [groups, setGroups] =
    useState([]);

  const [selectedGroup,
    setSelectedGroup] =
    useState(null);

  const [groupName,
    setGroupName] =
    useState("");

  // CHAT

  const [messages,
    setMessages] =
    useState([]);

  const [text,
    setText] =
    useState("");

  const [file,
    setFile] =
    useState(null);

  // ONLINE

  const [onlineUsers,
    setOnlineUsers] =
    useState([]);

  // TYPING

  const [typing,
    setTyping] =
    useState("");

  // EMOJI

  const [showEmoji,
    setShowEmoji] =
    useState(false);

  // UNREAD

  const [unread,
    setUnread] =
    useState({});

  const typingTimeoutRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  // =================================================
  // AUTO SCROLL
  // =================================================

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  // =================================================
  // CONNECT USER
  // =================================================

  useEffect(() => {

    if (user?._id) {

      socket.emit(
        "addUser",
        user._id
      );
    }

  }, [user]);

  // =================================================
  // FETCH USERS + GROUPS
  // =================================================

  useEffect(() => {

    if (user?._id) {

      fetchUsers();
      fetchGroups();
    }

  }, [user]);

  const fetchUsers =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/users"
          );

        setUsers(
          res.data.filter(
            (u) =>
              u._id !== user?._id
          )
        );

      } catch (error) {

        console.log(error);
      }
    };

  const fetchGroups =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/groups"
          );

        setGroups(res.data);

      } catch (error) {

        console.log(error);
      }
    };

  // =================================================
  // CREATE GROUP
  // =================================================

  const createGroup =
    async () => {

      if (!groupName) return;

      try {

        const res =
          await axios.post(
            "http://localhost:5000/api/groups",
            {
              name: groupName,
              members: [user._id],
              admin: user._id,
            }
          );

        setGroups((prev) => [
          ...prev,
          res.data,
        ]);

        setGroupName("");

      } catch (error) {

        console.log(error);
      }
    };

  // =================================================
  // ONLINE USERS
  // =================================================

  useEffect(() => {

    socket.on(
      "getOnlineUsers",

      (users) => {

        setOnlineUsers(users);
      }
    );

    return () => {

      socket.off(
        "getOnlineUsers"
      );
    };

  }, []);

  // =================================================
  // TYPING
  // =================================================

  useEffect(() => {

    socket.on(
      "show_typing",

      (data) => {

        setTyping(
          `${data.senderName} is typing...`
        );
      }
    );

    socket.on(
      "hide_typing",

      () => {

        setTyping("");
      }
    );

    return () => {

      socket.off(
        "show_typing"
      );

      socket.off(
        "hide_typing"
      );
    };

  }, []);

  // =================================================
  // OPEN PRIVATE CHAT
  // =================================================

  const openChat =
    async (receiver) => {

      setSelectedUser(receiver);

      setSelectedGroup(null);

      setUnread((prev) => ({
        ...prev,
        [receiver._id]: 0,
      }));

      try {

        const res =
          await axios.get(
            `http://localhost:5000/api/messages/${user._id}/${receiver._id}`
          );

        setMessages(res.data);

        for (const msg of res.data) {

          if (
            msg.senderId ===
              receiver._id ||

            msg.senderId?._id ===
              receiver._id
          ) {

            await axios.put(
              `http://localhost:5000/api/messages/read/${msg._id}`
            );

            socket.emit(
              "messageRead",
              {
                senderId:
                  receiver._id,

                messageId:
                  msg._id,
              }
            );
          }
        }

      } catch (error) {

        console.log(error);
      }
    };

  // =================================================
  // OPEN GROUP
  // =================================================

  const openGroup =
    async (group) => {

      setSelectedGroup(group);

      setSelectedUser(null);

      socket.emit(
        "joinGroup",
        group._id
      );

      try {

        const res =
          await axios.get(
            `http://localhost:5000/api/group-messages/${group._id}`
          );

        setMessages(res.data);

      } catch (error) {

        console.log(error);
      }
    };

  // =================================================
  // SEND MESSAGE
  // =================================================

  const sendMessage =
    async () => {

      if (!text && !file)
        return;

      try {

        // GROUP

        if (selectedGroup) {

          const formData =
            new FormData();

          formData.append(
            "groupId",
            selectedGroup._id
          );

          formData.append(
            "senderId",
            user._id
          );

          formData.append(
            "text",
            text
          );

          if (file) {

            formData.append(
              "media",
              file
            );
          }

          const res =
            await axios.post(
              "http://localhost:5000/api/group-messages",
              formData
            );

          setMessages((prev) => [
            ...prev,
            res.data,
          ]);

          socket.emit(
            "sendGroupMessage",
            res.data
          );

          setText("");
          setFile(null);

          return;
        }

        // PRIVATE

        const formData =
          new FormData();

        formData.append(
          "senderId",
          user._id
        );

        formData.append(
          "receiverId",
          selectedUser._id
        );

        formData.append(
          "text",
          text
        );

        if (file) {

          formData.append(
            "media",
            file
          );
        }

        const res =
          await axios.post(
            "http://localhost:5000/api/messages",
            formData
          );

        setMessages((prev) => [
          ...prev,
          res.data,
        ]);

        socket.emit(
          "sendMessage",
          res.data
        );

        setText("");
        setFile(null);

      } catch (error) {

        console.log(error);
      }
    };

  // =================================================
  // RECEIVE PRIVATE MESSAGE
  // =================================================

  useEffect(() => {

    socket.on(
      "receiveMessage",

      (newMessage) => {

        const audio =
          new Audio(
            notificationSound
          );

        audio.play();


        axios.put(
  `http://localhost:5000/api/messages/delivered/${newMessage._id}`
);

socket.emit(
  "messageDelivered",
  {
    senderId:
      newMessage.senderId,

    messageId:
      newMessage._id,
  }
);


        if (
          selectedUser &&
          (
            newMessage.senderId ===
              selectedUser._id ||

            newMessage.senderId?._id ===
              selectedUser._id
          )
        ) {

          setMessages((prev) => [
            ...prev,
            newMessage,
          ]);

        } else {

          setUnread((prev) => ({

            ...prev,

            [
              newMessage.senderId
            ]:

            (
              prev[
                newMessage.senderId
              ] || 0
            ) + 1,
          }));
        }
      }
    );

    return () => {

      socket.off(
        "receiveMessage"
      );
    };

  }, [selectedUser]);

  // =================================================
  // RECEIVE GROUP
  // =================================================

useEffect(() => {

  socket.on(
    "receiveGroupMessage",

    (newMessage) => {

      if (
        selectedGroup &&
        (
          newMessage.groupId?.toString() ===
            selectedGroup._id?.toString()

          ||

          newMessage.groupId?._id?.toString() ===
            selectedGroup._id?.toString()
        )
      ) {

        setMessages((prev) => [
          ...prev,
          newMessage,
        ]);
      }
    }
  );

  return () => {

    socket.off(
      "receiveGroupMessage"
    );
  };

}, [selectedGroup]);
  // =================================================
  // STATUS
  // =================================================

  useEffect(() => {

    socket.on(
      "messageDeliveredStatus",

      (data) => {

        setMessages((prev) =>
          prev.map((msg) => {

            if (
              msg._id ===
              data.messageId
            ) {

              return {
                ...msg,
                status:
                  "delivered",
              };
            }

            return msg;
          })
        );
      }
    );

    socket.on(
      "messageReadStatus",

      (data) => {

        setMessages((prev) =>
          prev.map((msg) => {

            if (
              msg._id ===
              data.messageId
            ) {

              return {
                ...msg,
                status: "read",
              };
            }

            return msg;
          })
        );
      }
    );

    return () => {

      socket.off(
        "messageDeliveredStatus"
      );

      socket.off(
        "messageReadStatus"
      );
    };

  }, []);

  // =================================================
  // UI
  // =================================================

  return (

    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#ece5dd",
      }}
    >

      {/* SIDEBAR */}

      <div
        style={{
          width: "30%",
          background: "white",
          borderRight:
            "1px solid #ddd",
          overflowY: "scroll",
        }}
      >

        <div
          style={{
            padding: "15px",
            background: "#075E54",
            color: "white",
            fontWeight: "bold",
          }}
        >


{/* GROUP SECTION */}

<div
  style={{
    padding: "10px",
    borderTop: "1px solid #ddd",
  }}
>

 <h3
  style={{
    color: "#075E54",
    marginBottom: "10px",
  }}
>
  Groups
</h3>

  <div
    style={{
      display: "flex",
      gap: "5px",
      marginBottom: "10px",
    }}
  >

    <input
      type="text"
      placeholder="Group name"
      value={groupName}
      onChange={(e) =>
        setGroupName(
          e.target.value
        )
      }
      style={{
        flex: 1,
        padding: "8px",
      }}
    />

    <button
      onClick={createGroup}
      style={{
        background: "#075E54",
        color: "teal",
        border: "none",
        padding: "8px 12px",
      }}
    >

      Create

    </button>

  </div>

  {groups.map((group) => (

    <div
      key={group._id}

      onClick={() =>
        openGroup(group)
      }

      style={{
        padding: "10px",
        borderBottom:
          "1px solid #5a5656",
        cursor: "pointer",
        background:
          selectedGroup?._id ===
          group._id
            ? "#14201c"
            : "white",
      }}
    >

      <span
  style={{
    color: "#075E54",
    fontWeight: "bold",
  }}
>
  👥 {group.name}
</span>

    </div>
  ))}

</div>


          Chats

        </div>

        {users.map((u) => (

          <div
            key={u._id}

            onClick={() =>
              openChat(u)
            }

            style={{
              padding: "15px",
              borderBottom:
                "1px solid #eee",

              cursor: "pointer",

              background:
                selectedUser?._id ===
                u._id
                  ? "#f0f0f0"
                  : "white",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
              }}
            >

              <strong>
                {u.name}
              </strong>

              {
                unread[u._id] > 0 && (

                  <span
                    style={{
                      background:
                        "green",

                      color:
                        "white",

                      borderRadius:
                        "50%",

                      width: "22px",

                      height: "22px",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      fontSize:
                        "12px",
                    }}
                  >

                    {
                      unread[u._id]
                    }

                  </span>
                )
              }

            </div>

            <small>

              {
                onlineUsers.includes(
                  u._id
                )

                  ? "🟢 Online"

                  : u.lastSeen

                  ? `Last seen ${new Date(
                      u.lastSeen
                    ).toLocaleTimeString()}`

                  : "Offline"
              }

            </small>

          </div>
        ))}

      </div>

      {/* CHAT AREA */}

      <div
        style={{
          width: "70%",
          display: "flex",
          flexDirection:
            "column",
        }}
      >

        {
          selectedUser ||
          selectedGroup

          ? (

            <>

              {/* HEADER */}

              <div
                style={{
                  padding: "15px",
                  background:
                    "#075E54",

                  color: "white",
                }}
              >

                {
                  selectedGroup

                  ? selectedGroup.name

                  : selectedUser.name
                }

                <div
                  style={{
                    fontSize:
                      "12px",
                  }}
                >

                  {typing}

                </div>

              </div>

              {/* CHAT */}

              <div
                style={{
                  flex: 1,
                  overflowY:
                    "scroll",

                  padding:
                    "15px",
                }}
              >

                {messages.map((msg) => (

                  <div
                    key={msg._id}

                    style={{
                      display:
                        "flex",

                      justifyContent:

                        (
                          msg.senderId?._id ===
                            user._id ||

                          msg.senderId ===
                            user._id
                        ) 

                          ? "flex-end"

                          : "flex-start",

                      marginBottom:
                        "10px",
                    }}
                  >

                    <div
                      style={{
                        background:

                          (
                            msg.senderId?._id ===
                              user._id ||

                            msg.senderId ===
                              user._id
                          )

                            ? "#DCF8C6"

                            : "white",

                        padding:
                          "10px",

                        borderRadius:
                          "10px",

                        maxWidth:
                          "300px",
                      }}
                    >

                      <div>
                        {msg.text}
                      </div>

                      {
                        msg.media && (

                          msg.mediaType.startsWith(
                            "image"
                          )

                          ? (

                            <img
                              src={`http://localhost:5000/uploads/${msg.media}`}

                              alt=""

                              width="200"

                              style={{
                                marginTop:
                                  "10px",

                                borderRadius:
                                  "10px",
                              }}
                            />
                          )

                          : (

                            <a
                              href={`http://localhost:5000/uploads/${msg.media}`}
                              target="_blank"
                            >

                              📄 Download File

                            </a>
                          )
                        )
                      }

                      <div
                        style={{
                          fontSize:
                            "10px",

                          color:
                            "gray",

                          marginTop:
                            "5px",

                          textAlign:
                            "right",
                        }}
                      >

                        {
                          new Date(
                            msg.createdAt
                          ).toLocaleTimeString()
                        }

                        {" "}

                        {
                          (
                            msg.senderId?._id ===
                              user._id ||

                            msg.senderId ===
                              user._id
                          ) && (

                            <>
                             {
  msg.status === "sent" && (
    <span
      style={{
        color: "gray",
        fontWeight: "bold",
        marginLeft: "5px",
      }}
    >
      ✓
    </span>
  )
}

{
  msg.status === "delivered" && (
    <span
      style={{
        color: "gray",
        fontWeight: "bold",
        marginLeft: "5px",
      }}
    >
      ✓✓
    </span>
  )
}
{
msg.status === "read" && (
  <span
    style={{
      color: "#2196F3",
      fontWeight: "bold",
      marginLeft: "5px",
    }}
  >
    ✓✓
  </span>
)
}
                            </>
                          )
                        }

                      </div>

                    </div>

                  </div>
                ))}

                <div
                  ref={
                    messagesEndRef
                  }
                />

              </div>

              {/* INPUT */}

              <div
                style={{
                  padding: "10px",
                  background:
                    "#f0f0f0",

                  display: "flex",
                  gap: "10px",
                  alignItems:
                    "center",
                }}
              >

                <button
                  onClick={() =>
                    setShowEmoji(
                      !showEmoji
                    )
                  }
                >

                  <FaSmile />

                </button>

                {
                  showEmoji && (

                    <div
                      style={{
                        position:
                          "absolute",

                        bottom:
                          "70px",
                      }}
                    >

                      <EmojiPicker
                        onEmojiClick={
                          (emojiData) => {

                            setText(
                              (prev) =>

                              prev +
                              emojiData.emoji
                            );
                          }
                        }
                      />

                    </div>
                  )
                }

                <input
                  type="text"

                  value={text}

                  placeholder="Type message"

                  onChange={(e) => {

                    setText(
                      e.target.value
                    );

                    if (
                      selectedUser
                    ) {

                      socket.emit(
                        "typing",
                        {
                          senderName:
                            user.name,

                          receiverId:
                            selectedUser._id,
                        }
                      );

                      if (
                        typingTimeoutRef.current
                      ) {

                        clearTimeout(
                          typingTimeoutRef.current
                        );
                      }

                      typingTimeoutRef.current =
                        setTimeout(
                          () => {

                            socket.emit(
                              "stop_typing",
                              {
                                receiverId:
                                  selectedUser._id,
                              }
                            );

                          },

                          1000
                        );
                    }
                  }}

                  style={{
                    flex: 1,
                    padding:
                      "10px",

                    borderRadius:
                      "20px",

                    border:
                      "none",
                  }}
                />

                <input
                  type="file"

                  onChange={(e) =>
                    setFile(
                      e.target.files[0]
                    )
                  }
                />

                <button
                  onClick={
                    sendMessage
                  }

                  style={{
                    background:
                      "#075E54",

                    color:
                      "white",

                    border:
                      "none",

                    padding:
                      "10px",

                    borderRadius:
                      "50%",
                  }}
                >

                  <FaPaperPlane />

                </button>

              </div>

            </>
          )

          : (

            <div
              style={{
                flex: 1,

                display: "flex",

                justifyContent:
                  "center",

                alignItems:
                  "center",

                fontSize:
                  "24px",

                color:
                  "gray",
              }}
            >

              Open a chat

            </div>
          )
        }

      </div>

    </div>
  );
}

export default Chat;