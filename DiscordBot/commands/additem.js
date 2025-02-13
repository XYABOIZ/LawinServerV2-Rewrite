const Asteria = require('../../../utilities/asteriasdk/index.js');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Users = require('../../../model/user.js');
const Profiles = require('../../../model/profiles.js');
const fs = require('fs');
const path = require('path');
const dirname = require('dirname-filename-esm');
const destr = require('destr');

const __dirname = dirname(import.meta);

const asteria = new Asteria({
    collectAnonStats: true,
    throwErrors: true,
});

const data = new SlashCommandBuilder()
    .setName('addcosmetic')
    .setDescription('Allows you to give a user any skin, pickaxe, glider, etc.')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user you want to give the cosmetic to')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('cosmeticname')
            .setDescription('The name of the cosmetic you want to give')
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false);

async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const selectedUser = interaction.options.getUser('user');
    const selectedUserId = selectedUser.id;

    const user = await Users.findOne({ discordId: selectedUserId });
    if (!user) return interaction.editReply({ content: "That user does not own an account" });
    const profile = await Profiles.findOne({ accountId: user.accountId });
    if (!profile) return interaction.editReply({ content: "That user does not own an account" });

    const cosmeticname = interaction.options.getString('cosmeticname');

    try {
        await fetch(`https://fortnite-api.com/v2/cosmetics/br/search?name=${cosmeticname}`)
            .then(res => res.json())
            .then(async json => {
                const cosmeticFromAPI = json.data;
                if (!cosmeticFromAPI) return await interaction.editReply({ content: "Could not find the cosmetic" });

                const cosmeticimage = cosmeticFromAPI.images.icon;

                const regex = /^(?:[A-Z][a-z]*\b\s*)+$/;
                if (!regex.test(cosmeticname)) return await interaction.editReply({ content: "Please check for correct casing. E.g 'renegade raider' is wrong, but 'Renegade Raider' is correct." });

                let cosmetic = {};

                const file = fs.readFileSync(path.join(__dirname, "../../../../Config/DefaultProfiles/allathena.json"));
                const jsonFile = destr(file.toString());
                const items = jsonFile.items;

                let foundcosmeticname = "";
                let found = false;

                for (const key of Object.keys(items)) {
                    const [type, id] = key.split(":");
                    if (id === cosmeticFromAPI.id) {
                        foundcosmeticname = key;
                        if (profile.profiles.athena.items[key]) {
                            return await interaction.editReply({ content: "That user already has that cosmetic" });
                        }
                        found = true;
                        cosmetic = items[key];
                        break;
                    }
                }

                if (!found) return await interaction.editReply({ content: `Could not find the cosmetic ${cosmeticname}` });

                await Profiles.findOneAndUpdate(
                    { accountId: user.accountId },
                    {
                        $set: {
                            [`profiles.athena.items.${foundcosmeticname}`]: cosmetic,
                        },
                    },
                    { new: true },
                ).catch(async (err) => {
                    console.log(err);
                    return await interaction.editReply({ content: "An error occurred while adding the cosmetic" });
                });

                const embed = new EmbedBuilder()
                    .setTitle("Cosmetic added")
                    .setDescription("Successfully gave the user the cosmetic: " + cosmeticname)
                    .setThumbnail(cosmeticimage)
                    .setColor("#2b2d31")
                    .setFooter({
                        text: "Momentum",
                        iconURL: "https://cdn.discordapp.com/app-assets/432980957394370572/1084188429077725287.png",
                    })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    data,
    execute
};