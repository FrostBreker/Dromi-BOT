const { AttachmentBuilder } = require("discord.js");
const { request } = require('undici');
const { createCanvas, Image, loadImage } = require('@napi-rs/canvas');

const baseCanva = async (user) => {
    // Create a 700x250 pixel canvas and get its context
    // The context will be used to modify the canvas
    const canvas = createCanvas(1100, 500);
    const ctx = canvas.getContext('2d');

    // Background image
    const background = await loadImage('./images/wallpaper.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Black rounded rectangle with a margin of 20 pixels
    const margin = 40;
    const cornerRadius = 10; // Adjust the corner radius as needed

    ctx.beginPath();
    ctx.moveTo(margin + cornerRadius, margin);
    ctx.lineTo(canvas.width - margin - cornerRadius, margin);
    ctx.arcTo(canvas.width - margin, margin, canvas.width - margin, margin + cornerRadius, cornerRadius);
    ctx.lineTo(canvas.width - margin, canvas.height - margin - cornerRadius);
    ctx.arcTo(canvas.width - margin, canvas.height - margin, canvas.width - margin - cornerRadius, canvas.height - margin, cornerRadius);
    ctx.lineTo(margin + cornerRadius, canvas.height - margin);
    ctx.arcTo(margin, canvas.height - margin, margin, canvas.height - margin - cornerRadius, cornerRadius);
    ctx.lineTo(margin, margin + cornerRadius);
    ctx.arcTo(margin, margin, margin + cornerRadius, margin, cornerRadius);
    ctx.closePath();

    // Set the color to black
    ctx.fillStyle = '#090c0d'; // Adjust opacity if needed

    // Fill the rounded rectangle
    ctx.fill();

    // User's profile picture
    const { body } = await request(user.displayAvatarURL({ format: 'jpg', size: 512 }));
    const avatar = new Image();
    avatar.src = Buffer.from(await body.arrayBuffer());

    const profilePic = await loadImage(avatar); // Replace with profile picture path
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw a circle to clip the profile picture
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY - 60, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Obtenir les dimensions de l'image et les ajuster pour qu'elle remplisse le cercle
    const imageSize = 200; // Nouvelle taille de l'image
    const aspectRatio = profilePic.width / profilePic.height;
    let drawWidth = imageSize;
    let drawHeight = imageSize;

    if (aspectRatio < 1) {
        drawWidth = imageSize * aspectRatio;
    } else {
        drawHeight = imageSize / aspectRatio;
    }

    const imageX = centerX - drawWidth / 2;
    const imageY = centerY - 60 - drawHeight / 2; // Ajuster la position verticale pour centrer l'image

    // Dessiner la photo de profil agrandie pour remplir le cercle
    ctx.drawImage(profilePic, imageX, imageY, drawWidth, drawHeight);

    // Ajouter un contour blanc autour de la photo de profil
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();

    return { canvas, ctx, centerX, centerY };
}

class MiscCanva {
    static async generateImageBan(user, counter) {
        const { canvas, ctx, centerX, centerY } = await baseCanva(user);

        // Add text below the profile picture
        ctx.font = '36px Arial'; // Adjust font size
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${user.displayName} just been banned from the server!`, centerX, centerY + 100); // Adjust text position

        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#7E7E7E';
        ctx.textAlign = 'center';
        ctx.fillText(`Ban counter: #${counter}`, centerX, centerY + 160);

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });
        return attachment;
    }

    static async generateImageKicked(user, counter) {
        const { canvas, ctx, centerX, centerY } = await baseCanva(user);

        // Add text below the profile picture
        ctx.font = '36px Arial'; // Adjust font size
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${user.displayName} just been kicked from the server!`, centerX, centerY + 100); // Adjust text position

        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#7E7E7E';
        ctx.textAlign = 'center';
        ctx.fillText(`Kick counter: #${counter}`, centerX, centerY + 160);


        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });
        return attachment;
    }

    static async generateImageTimeout(user, counter) {
        const { canvas, ctx, centerX, centerY } = await baseCanva(user);

        // Add text below the profile picture
        ctx.font = '36px Arial'; // Adjust font size
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${user.displayName} just been timeout!`, centerX, centerY + 100); // Adjust text position

        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#7E7E7E';
        ctx.textAlign = 'center';
        ctx.fillText(`Timeout counter: #${counter}`, centerX, centerY + 160);

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });
        return attachment;
    }

    static async generateImageJoined(user, memberCount) {
        const { canvas, ctx, centerX, centerY } = await baseCanva(user);

        // Add text below the profile picture
        ctx.font = '36px Arial'; // Adjust font size
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${user.displayName} just joined the server!`, centerX, centerY + 100); // Adjust text position

        // Add text "Member #150" below "Banned"
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#7E7E7E';
        ctx.textAlign = 'center';
        ctx.fillText(`Member #${memberCount}`, centerX, centerY + 160);


        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });
        return attachment;
    }
}

module.exports = MiscCanva;