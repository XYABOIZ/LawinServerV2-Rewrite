const { SlashCommandBuilder } = require("discord.js");
const Users = require('../../../model/user.js');
const Profiles = require('../../../model/profiles.js');

const data = new SlashCommandBuilder()
	.setName('vbucks')
	.setDescription('Lets you change a user\'s amount of vbucks')
	.addUserOption(option =>
		option.setName('user')
			.setDescription('The user you want to change the vbucks of')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('vbucks')
			.setDescription('The amount of vbucks you want to give (Can be a negative number to take vbucks)')
			.setRequired(true))
	.setDefaultMemberPermissions(8) // Use the numeric value for PermissionFlagsBits.BanMembers, in this case, 8
	.setDMPermission(false);

async function execute(interaction) {
	const selectedUser = interaction.options.getUser('user');
	const selectedUserId = selectedUser.id;

	const user = await Users.findOne({ discordId: selectedUserId });
	if (!user) return interaction.reply({ content: "That user does not own an account", ephemeral: true });

	const vbucks = parseInt(interaction.options.getString('vbucks'));

	const profile = await Profiles.findOneAndUpdate(
		{ accountId: user.accountId },
		{ $inc: { 'profiles.common_core.items.Currency:MtxPurchased.quantity': vbucks } },
	);
	if (!profile) return interaction.reply({ content: "That user does not own an account", ephemeral: true });

	const embed = new EmbedBuilder()
		.setTitle("vBucks changed")
		.setDescription(`Successfully changed the amount of vbucks for <@${selectedUserId}> by ${vbucks}`)
		.setColor("#2b2d31")
		.setFooter({
			text: "Momentum",
			iconURL: "https://cdn.discordapp.com/app-assets/432980957394370572/1084188429077725287.png",
		})
		.setTimestamp();

	await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = {
	data,
	execute
};