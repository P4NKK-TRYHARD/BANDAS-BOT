const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const config = require('../../config.json')

module.exports = {

    data: new SlashCommandBuilder()

        .setName('roleadd')
        .setDescription('Da rol a un miembro de tu banda.')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription("Dale el rol de tu banda a un usuario.")
                .setRequired(true)),

    async run(client, interaction) {

        const user = interaction.options.getMember('usuario')

        if (interaction.channel.id !== config.canalRol) return interaction.reply({ content: `No puedes usar este comando en este canal! Por Favor utiliza el canal de <#${config.canalRol}>`, ephemeral: true })
        if (user === null) return interaction.reply({ content: "Este usuario no está en el discord.", ephemeral: true })
        if (user == config.botId) return interaction.reply({ content: "Que haces bobo, no puedes darme rango de tu estupida banda a mi", ephemeral: true })

        // -------------------------------------------------------

        const rolUser = await user.roles.cache.map(a => a.name)
        if (rolUser === null) return interaction.reply({ content: "Algo salio mal intentalo de nuevo", ephemeral: true })

        const rolFiltradoUser = rolUser.filter(a => a.includes(config.includes))

        const rolFinalUser = await interaction.guild.roles.cache.find(role => role.name == rolFiltradoUser)

        // -------------------------------------------------------

        const rol = await interaction.member.roles.cache.map(a => a.name) // Obtiene todos los roles del jefe de Banda.

        const rolFiltrado = rol.filter(a => a.includes(config.includes)) // Filtra todos los roles los cuales incluien "Banda ".

        const rolFinal = await interaction.guild.roles.cache.find(role => role.name == rolFiltrado)

        // -------------------------------------------------------

        if (rolFinal === undefined) return interaction.reply({ content: "**No puedes dar rol.**\n> 1. No perteneces a ninguna banda\n> 2. Tienes más de un rol de banda.", ephemeral: true })

        if (!interaction.member.roles.cache.has(config.rolJefe)) return interaction.reply({ content: "No tienes el rol de jefe de banda", ephemeral: true })

        if (user.roles.cache.has(rolFinal.id)) return interaction.reply({ content: "Este miembro ya tiene el rol de tu banda.", ephemeral: true })

        if (rolFinalUser === undefined) {

            await user.roles.add(rolFinal)

        } else {

            return interaction.reply({ content: "Este miembro ya pertenece a una banda.\n> Avisa a su jefe para que se lo quite o que abra ticket.", ephemeral: true })

        }


        const embed = new Discord.MessageEmbed()
            .setTitle('Rol Agregado')
            .setDescription("Si quieres solicitar el jefe de banda a un usuario tienes que abrir un ticket!")
            .setAuthor(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
            .setFooter(`Sistema de Roles・${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '🙍‍♂️ ・Jefe ', value: `${interaction.member}`, inline: true },
                { name: '🧑 ・Miembro ', value: `${user}`, inline: true },
                { name: '📩 ・Rol Agregado', value: `${rolFinal}`, inline: true },
            )
            .setColor(config.colorMain)

        interaction.reply({ embeds: [embed] })

    }
}