import { db } from "../services/firebase";


export function readListChat(){
    let a = [];
    db.ref('channels').on("value",snapshot => {
        snapshot.forEach(snap=>{
            a.push(snap.val())
        });
        return a;
    });
}

export function readChats() {
  let abc = [];
  db.ref("chats").on("value", snapshot => {
    snapshot.forEach(snap => {
      abc.push(snap.val())
    });
    return abc;
  });
}

export function writeChats(message) {
  return db.ref("chats").push({
    content: message.content,
    timestamp: message.timestamp,
    uid: message.uid
  });
}