const { Client } = require("eris");
const { token, prefix, requiredPermission } = require("./config");

const client = new Client(token);

client.on("ready", () => console.log(`Client ready as ${client.user.username}.`));
client.on("messageCreate", msg => {
  if (msg.author.bot || !msg.member.permission.has(requiredPermission) || !msg.content.startsWith(prefix)) return;

  const [command, ...args] = msg.content
    .slice(prefix.length)
    .trim()
    .split(" ");

  if (command === "mention") {
    if (!args[0]) return msg.channel.createMessage(":x: A role to mention all online members of must be provided.");

    const role = msg.channel.guild.roles.find(r => r.name === args.join(" "));
    if (!role) return msg.channel.createMessage(":x: Invalid role.");

    let res = "";
    msg.channel.guild.members
      .filter(m => (m.status === "online" && m.roles.includes(role.id)))
      .forEach(mem => (res += mem.mention + " "));

    if (res === "") return msg.channel.createMessage(":x: No members are online with that role.");

    return msg.channel.createMessage(res);
  }
});

client.connect();
