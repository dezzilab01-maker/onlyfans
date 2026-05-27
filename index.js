<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>OnlyFans-like – rejestracja + Discord</title>
    <style>
        body { font-family: Arial; max-width: 600px; margin: auto; padding: 20px; }
        input, textarea, button { width: 100%; margin: 8px 0; padding: 10px; }
        .preview { border: 1px solid #ddd; margin-top: 20px; padding: 20px; }
        img { max-width: 100px; border-radius: 50%; }
        .banner { max-width: 100%; height: 100px; object-fit: cover; }
        .success { color: green; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>Rejestracja twórcy</h1>
    <form id="creatorForm">
        <input type="text" id="firstName" placeholder="Imię" required>
        <input type="text" id="lastName" placeholder="Nazwisko" required>
        <input type="text" id="username" placeholder="@nazwa (np. @jan_kowalski)" required>
        <input type="text" id="displayName" placeholder="Nazwa wyświetlana" required>
        <textarea id="bio" placeholder="Opis twórcy" rows="3"></textarea>

        <label>Zdjęcie profilowe:</label>
        <input type="file" id="avatar" accept="image/*">

        <label>Baner:</label>
        <input type="file" id="banner" accept="image/*">

        <button type="submit">Wyślij → Discord</button>
    </form>
    <div id="status"></div>

    <script>
        // 🔁 WKLEJ TUTAJ SWÓJ URL WEBHOOK
        const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/TWOJ_ID/TWOJ_TOKEN";

        function toBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        document.getElementById("creatorForm").addEventListener("submit", async (e) => {
            e.preventDefault();

            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const username = document.getElementById("username").value;
            const displayName = document.getElementById("displayName").value;
            const bio = document.getElementById("bio").value;
            const avatarFile = document.getElementById("avatar").files[0];
            const bannerFile = document.getElementById("banner").files[0];

            if (!avatarFile || !bannerFile) {
                document.getElementById("status").innerHTML = "<span style='color:red'>❌ Dodaj zdjęcie profilowe i baner</span>";
                return;
            }

            document.getElementById("status").innerHTML = "⏳ Wysyłanie na Discord...";

            const avatarBase64 = await toBase64(avatarFile);
            const bannerBase64 = await toBase64(bannerFile);

            const embed = {
                title: "📸 Nowy twórca się zarejestrował!",
                color: 0xFF69B4, // różowy jak OnlyFans
                fields: [
                    { name: "Imię i nazwisko", value: `${firstName} ${lastName}`, inline: true },
                    { name: "@nazwa", value: username, inline: true },
                    { name: "Nazwa wyświetlana", value: displayName, inline: true },
                    { name: "Opis", value: bio || "brak", inline: false }
                ],
                image: { url: bannerBase64 }, // baner jako duży obraz
                thumbnail: { url: avatarBase64 }, // avatar jako miniaturka
                footer: { text: "Rejestracja przez formularz" }
            };

            try {
                const response = await fetch(DISCORD_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ embeds: [embed] })
                });

                if (response.ok) {
                    document.getElementById("status").innerHTML = "<span class='success'>✅ Wysłano na Discord! Zobacz kanał.</span>";
                    document.getElementById("creatorForm").reset();
                } else {
                    throw new Error("Błąd webhooka");
                }
            } catch (error) {
                document.getElementById("status").innerHTML = "<span style='color:red'>❌ Błąd wysyłki. Sprawdź URL webhook.</span>";
                console.error(error);
            }
        });
    </script>
</body>
</html>
