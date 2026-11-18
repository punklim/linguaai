"use strict";

/* ===== Configuration serveur (APK Android) =====
   Dans l'APK il n'y a pas de serveur local : on appelle ton serveur Render.
   Dans le navigateur (npm start), on garde des URL relatives. */
const RENDER_URL = "https://TON-URL-RENDER.onrender.com"; // <-- REMPLACE par ta vraie URL Render
const IS_NATIVE = !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
const API_BASE = IS_NATIVE ? RENDER_URL : "";

/* =========================================================
   LinguaAI — données
   ========================================================= */
const LEVELS = { debutant: "Débutant", intermediaire: "Intermédiaire", professionnel: "Professionnel" };

const VOCAB_DATA = {
  en: {
    speechLang: "en-US", name: "Anglais",
    greeting: "Hello! I am your English tutor. How are you today? Try answering in English!",
    suggestions: ["Hello! I want to practice English.", "I would like to order a coffee.", "Can you help me with my grammar?"],
    live: {
      debutant: ["Hello! Welcome to our live class. What is your name and where are you from?", "Hi! Tell me about your family. Who do you live with?", "Hello! What do you like to eat for breakfast?"],
      intermediaire: ["Hello! Tell me about your last holiday. Where did you go and what did you do?", "Hi! What is your daily routine like during the week?", "Hello! Describe your best friend. What is he or she like?"],
      professionnel: ["Good morning! Please introduce yourself and describe your current job.", "Hello! Tell me about a challenge you solved at work recently.", "Good morning! Why do you want to improve your professional English?"]
    },
    debutant: [
      { cat: "Salutation", word: "Hello, how are you?", phon: "/həˈləʊ haʊ ɑː juː/", trans: "Bonjour, comment vas-tu ?", ex: "Hello, how are you today?" },
      { cat: "Politesse", word: "Thank you very much", phon: "/θæŋk juː ˈveri mʌtʃ/", trans: "Merci beaucoup", ex: "Thank you very much for your help." },
      { cat: "Quotidien", word: "I would like a coffee, please", phon: "/aɪ wʊd laɪk ə ˈkɒfi pliːz/", trans: "Je voudrais un café, s'il vous plaît", ex: "Good morning, I would like a coffee, please." },
      { cat: "Orientation", word: "Where is the train station?", phon: "/weər ɪz ðə treɪn ˈsteɪʃn/", trans: "Où est la gare ?", ex: "Excuse me, where is the train station?" },
      { cat: "Présentation", word: "My name is Alex", phon: "/maɪ neɪm ɪz ˈælɪks/", trans: "Je m'appelle Alex", ex: "Hi! My name is Alex and I live in Paris." },
      { cat: "Aide", word: "Could you repeat that, please?", phon: "/kʊd juː rɪˈpiːt ðæt pliːz/", trans: "Pourriez-vous répéter, s'il vous plaît ?", ex: "Sorry, I didn't understand. Could you repeat that, please?" }
    ],
    intermediaire: [
      { cat: "Travail", word: "I am looking forward to meeting you", phon: "/aɪ æm ˈlʊkɪŋ ˈfɔːwəd tə ˈmiːtɪŋ juː/", trans: "J'ai hâte de vous rencontrer", ex: "Thank you for the invitation, I am looking forward to meeting you." },
      { cat: "Opinion", word: "In my opinion, it depends on the context", phon: "/ɪn maɪ əˈpɪnjən ɪt dɪˈpendz ɒn ðə ˈkɒntekst/", trans: "À mon avis, cela dépend du contexte", ex: "In my opinion, it depends on the context of the project." },
      { cat: "Voyage", word: "My flight has been delayed", phon: "/maɪ flaɪt hæz biːn dɪˈleɪd/", trans: "Mon vol a été retardé", ex: "Unfortunately, my flight has been delayed by two hours." },
      { cat: "Habitude", word: "I am getting used to speaking English", phon: "/aɪ æm ˈɡetɪŋ juːst tə ˈspiːkɪŋ ˈɪŋɡlɪʃ/", trans: "Je m'habitue à parler anglais", ex: "After a few weeks, I am getting used to speaking English every day." },
      { cat: "Décision", word: "Let's weigh the pros and cons", phon: "/lets weɪ ðə prəʊz ənd kɒnz/", trans: "Pesons le pour et le contre", ex: "Before signing, let's weigh the pros and cons carefully." },
      { cat: "Expression", word: "Better late than never", phon: "/ˈbetə leɪt ðæn ˈnevə/", trans: "Mieux vaut tard que jamais", ex: "You finally finished the report, better late than never!" }
    ],
    professionnel: [
      { cat: "Réunion", word: "Could we schedule a meeting for next week?", phon: "/kʊd wiː ˈʃedjuːl ə ˈmiːtɪŋ fə nekst wiːk/", trans: "Pourrions-nous planifier une réunion la semaine prochaine ?", ex: "Could we schedule a meeting for next week to review the budget?" },
      { cat: "Email", word: "I will send you the report by Friday", phon: "/aɪ wɪl send juː ðə rɪˈpɔːt baɪ ˈfraɪdeɪ/", trans: "Je vous enverrai le rapport d'ici vendredi", ex: "I will send you the report by Friday afternoon." },
      { cat: "Email", word: "Please find the attached document", phon: "/pliːz faɪnd ði əˈtætʃt ˈdɒkjʊmənt/", trans: "Veuillez trouver le document ci-joint", ex: "Please find the attached document for your review." },
      { cat: "Projet", word: "We need to meet the deadline", phon: "/wiː niːd tə miːt ðə ˈdedlaɪn/", trans: "Nous devons respecter la date limite", ex: "We need to meet the deadline, so let's prioritise." },
      { cat: "Recrutement", word: "I would like to apply for the position", phon: "/aɪ wʊd laɪk tə əˈplaɪ fə ðə pəˈzɪʃn/", trans: "Je souhaite postuler au poste", ex: "I would like to apply for the position of security supervisor." },
      { cat: "Suivi", word: "Let's follow up on this next week", phon: "/lets ˈfɒləʊ ʌp ɒn ðɪs nekst wiːk/", trans: "Refaisons le point là-dessus la semaine prochaine", ex: "Thanks everyone, let's follow up on this next week." }
    ]
  },
  es: {
    speechLang: "es-ES", name: "Espagnol",
    greeting: "¡Hola! Soy tu tutor de español. ¿Cómo estás hoy? ¡Intenta responder en español!",
    suggestions: ["¡Hola! Quiero practicar español.", "Quisiera pedir un café, por favor.", "¿Cómo se dice 'merci' en español?"],
    live: {
      debutant: ["¡Hola! Bienvenido a la clase. ¿Cómo te llamas y de dónde eres?", "¡Hola! ¿Qué te gusta comer en el desayuno?", "¡Hola! Háblame de tu familia. ¿Con quién vives?"],
      intermediaire: ["¡Hola! Cuéntame sobre tus últimas vacaciones. ¿Adónde fuiste y qué hiciste?", "¡Hola! ¿Cómo es tu rutina diaria durante la semana?", "¡Hola! Describe a tu mejor amigo. ¿Cómo es?"],
      professionnel: ["¡Buenos días! Preséntate y describe tu trabajo actual.", "¡Hola! Cuéntame un problema que resolviste recientemente en el trabajo.", "¡Buenos días! ¿Por qué quieres mejorar tu español profesional?"]
    },
    debutant: [
      { cat: "Salutation", word: "Hola, ¿cómo estás?", phon: "/ˈo.la ˈko.mo esˈtas/", trans: "Bonjour, comment vas-tu ?", ex: "¡Hola, amigo! ¿Cómo estás hoy?" },
      { cat: "Politesse", word: "Muchas gracias", phon: "/ˈmu.tʃas ˈɡɾa.θjas/", trans: "Merci beaucoup", ex: "Muchas gracias por tu ayuda." },
      { cat: "Quotidien", word: "Quisiera un café, por favor", phon: "/kiˈsje.ɾa un kaˈfe poɾ faˈβoɾ/", trans: "Je voudrais un café, s'il vous plaît", ex: "Buenos días, quisiera un café, por favor." },
      { cat: "Orientation", word: "¿Dónde está la estación?", phon: "/ˈdon.de esˈta la es.taˈθjon/", trans: "Où est la gare ?", ex: "Perdone, ¿dónde está la estación de tren?" },
      { cat: "Présentation", word: "Me llamo Sofía", phon: "/me ˈʎa.mo soˈfi.a/", trans: "Je m'appelle Sofia", ex: "Hola, me llamo Sofía y soy estudiante." },
      { cat: "Aide", word: "No entiendo, ¿puedes repetir?", phon: "/no enˈtjen.do ˈpwe.ðes re.peˈtiɾ/", trans: "Je ne comprends pas, peux-tu répéter ?", ex: "Lo siento, no entiendo, ¿puedes repetir más despacio?" }
    ],
    intermediaire: [
      { cat: "Travail", word: "Tengo muchas ganas de empezar", phon: "/ˈteŋ.ɡo ˈmu.tʃas ˈɡa.nas de em.peˈθaɾ/", trans: "J'ai très envie de commencer", ex: "Es un proyecto genial, tengo muchas ganas de empezar." },
      { cat: "Opinion", word: "Desde mi punto de vista", phon: "/ˈdez.de mi ˈpun.to de ˈβis.ta/", trans: "De mon point de vue", ex: "Desde mi punto de vista, necesitamos más tiempo." },
      { cat: "Voyage", word: "El vuelo se ha retrasado", phon: "/el ˈbwe.lo se a re.tɾaˈsa.ðo/", trans: "Le vol a été retardé", ex: "El vuelo se ha retrasado por el mal tiempo." },
      { cat: "Expression", word: "Más vale tarde que nunca", phon: "/mas ˈβa.le ˈtaɾ.ðe ke ˈnuŋ.ka/", trans: "Mieux vaut tard que jamais", ex: "Por fin llegaste, más vale tarde que nunca." },
      { cat: "Projet", word: "Estoy aprendiendo poco a poco", phon: "/esˈtoj a.pɾenˈdjen.do ˈpo.ko a ˈpo.ko/", trans: "J'apprends petit à petit", ex: "El español es divertido, estoy aprendiendo poco a poco." },
      { cat: "Demande", word: "¿Te importaría ayudarme?", phon: "/te im.poɾ.taˈɾi.a a.ʝuˈðaɾ.me/", trans: "Cela te dérangerait-il de m'aider ?", ex: "¿Te importaría ayudarme con este ejercicio?" }
    ],
    professionnel: [
      { cat: "Email", word: "Le agradezco su respuesta", phon: "/le a.ɣɾa.ˈðes.ko su res.ˈpwes.ta/", trans: "Je vous remercie de votre réponse", ex: "Le agradezco su respuesta tan rápida." },
      { cat: "Email", word: "Adjunto el informe solicitado", phon: "/ad.ˈxun.to el im.ˈfoɾ.me so.li.ˈsi.ta.ðo/", trans: "Je joins le rapport demandé", ex: "Buenos días, adjunto el informe solicitado." },
      { cat: "Réunion", word: "¿Podemos programar una reunión?", phon: "/po.ˈðe.mos pɾo.ɣɾa.ˈmaɾ ˈu.na re.u.ˈnjon/", trans: "Pouvons-nous programmer une réunion ?", ex: "¿Podemos programar una reunión para el lunes?" },
      { cat: "Projet", word: "Tenemos que cumplir el plazo", phon: "/te.ˈne.mos ke kum.ˈplir el ˈpla.θo/", trans: "Nous devons respecter le délai", ex: "Tenemos que cumplir el plazo de entrega." },
      { cat: "Recrutement", word: "Quisiera solicitar el puesto", phon: "/ki.ˈsje.ɾa so.li.si.ˈtaɾ el ˈpwes.to/", trans: "Je souhaiterais postuler au poste", ex: "Quisiera solicitar el puesto de supervisor." },
      { cat: "Politesse", word: "Quedo a su disposición", phon: "/ˈke.ðo a su dis.po.si.ˈθjon/", trans: "Je reste à votre disposition", ex: "Para cualquier duda, quedo a su disposición." }
    ]
  },
  it: {
    speechLang: "it-IT", name: "Italien",
    greeting: "Ciao! Sono il tuo tutor di italiano. Come stai oggi? Prova a rispondere in italiano!",
    suggestions: ["Ciao! Vorrei praticare l'italiano.", "Vorrei un caffè, per favore.", "Come si dice 'bonjour' in italiano?"],
    live: {
      debutant: ["Ciao! Benvenuto alla lezione. Come ti chiami e di dove sei?", "Ciao! Cosa ti piace mangiare a colazione?", "Ciao! Parlami della tua famiglia. Con chi vivi?"],
      intermediaire: ["Ciao! Raccontami le tue ultime vacanze. Dove sei andato e cosa hai fatto?", "Ciao! Com'è la tua giornata tipica durante la settimana?", "Ciao! Descrivi il tuo migliore amico. Com'è?"],
      professionnel: ["Buongiorno! Presentati e descrivi il tuo lavoro attuale.", "Salve! Raccontami un problema che hai risolto di recente al lavoro.", "Buongiorno! Perché vuoi migliorare il tuo italiano professionale?"]
    },
    debutant: [
      { cat: "Salutation", word: "Ciao, come stai?", phon: "/ˈtʃa.o ˈko.me ˈstai/", trans: "Salut, comment vas-tu ?", ex: "Ciao Marco, come stai oggi?" },
      { cat: "Politesse", word: "Grazie mille", phon: "/ˈɡrat.tsje ˈmil.le/", trans: "Merci beaucoup", ex: "Grazie mille per il tuo aiuto!" },
      { cat: "Quotidien", word: "Vorrei un caffè, per favore", phon: "/vorˈrɛi un kafˈfɛ per faˈvo.re/", trans: "Je voudrais un café, s'il vous plaît", ex: "Buongiorno, vorrei un caffè, per favore." },
      { cat: "Orientation", word: "Dov'è la stazione?", phon: "/doˈvɛ la statˈtsjo.ne/", trans: "Où est la gare ?", ex: "Scusi, dov'è la stazione ferroviaria?" },
      { cat: "Présentation", word: "Mi chiamo Luca", phon: "/mi ˈkja.mo ˈlu.ka/", trans: "Je m'appelle Luca", ex: "Piacere, mi chiamo Luca e vivo a Roma." },
      { cat: "Aide", word: "Può ripetere, per favore?", phon: "/pwɔ riˈpɛ.te.re per faˈvo.re/", trans: "Pouvez-vous répéter, s'il vous plaît ?", ex: "Non ho capito bene, può ripetere, per favore?" }
    ],
    intermediaire: [
      { cat: "Travail", word: "Non vedo l'ora di iniziare", phon: "/non ˈve.do ˈlo.ra di i.nitˈtsja.re/", trans: "J'ai hâte de commencer", ex: "È un'ottima idea, non vedo l'ora di iniziare." },
      { cat: "Opinion", word: "Secondo me, è una buona scelta", phon: "/seˈkon.do me ɛ ˈu.na ˈbwɔ.na ˈʃel.ta/", trans: "À mon avis, c'est un bon choix", ex: "Secondo me, è una buona scelta per tutti." },
      { cat: "Voyage", word: "Il treno è in ritardo", phon: "/il ˈtrɛ.no ɛ in riˈtar.do/", trans: "Le train est en retard", ex: "Purtroppo il treno è in ritardo di venti minuti." },
      { cat: "Expression", word: "Meglio tardi che mai", phon: "/ˈmɛʎ.ʎo ˈtar.di ke ˈmai/", trans: "Mieux vaut tard que jamais", ex: "Sei finalmente arrivato: meglio tardi che mai!" },
      { cat: "Habitude", word: "Sto imparando a parlare italiano", phon: "/stɔ im.paˈran.do a parˈla.re i.taˈlja.no/", trans: "J'apprends à parler italien", ex: "Sto imparando a parlare italiano ogni giorno." },
      { cat: "Politesse", word: "Ti dispiace se apro la finestra?", phon: "/ti diˈspja.tʃe se ˈa.pro la fiˈnɛ.stra/", trans: "Ça te dérange si j'ouvre la fenêtre ?", ex: "Fa caldo qui, ti dispiace se apro la finestra?" }
    ],
    professionnel: [
      { cat: "Email", word: "Le scrivo per chiedere informazioni", phon: "/le ˈskri.vo per kjeˈde.re in.for.matˈtsjo.ni/", trans: "Je vous écris pour demander des informations", ex: "Buongiorno, le scrivo per chiedere informazioni sul prodotto." },
      { cat: "Email", word: "Allego il documento richiesto", phon: "/alˈle.go il do.kuˈmen.to riˈkjɛ.sto/", trans: "Je joins le document demandé", ex: "Come concordato, allego il documento richiesto." },
      { cat: "Réunion", word: "Possiamo fissare una riunione?", phon: "/posˈsja.mo fisˈsa.re ˈu.na riuˈnjo.ne/", trans: "Pouvons-nous fixer une réunion ?", ex: "Possiamo fissare una riunione per giovedì?" },
      { cat: "Projet", word: "Dobbiamo rispettare la scadenza", phon: "/dobˈbja.mo ri.spetˈta.re la skaˈdɛn.tsa/", trans: "Nous devons respecter l'échéance", ex: "Dobbiamo rispettare la scadenza del progetto." },
      { cat: "Recrutement", word: "Vorrei candidarmi per questa posizione", phon: "/vorˈrɛi kan.diˈdar.mi per ˈkwe.sta po.ziˈtsjo.ne/", trans: "Je voudrais postuler à ce poste", ex: "Vorrei candidarmi per questa posizione di responsabile." },
      { cat: "Politesse", word: "Resto a sua disposizione", phon: "/ˈrɛ.sto a ˈsu.a di.spo.ziˈtsjo.ne/", trans: "Je reste à votre disposition", ex: "Per qualsiasi chiarimento, resto a sua disposizione." }
    ]
  },
  fr: {
    speechLang: "fr-FR", name: "Français",
    greeting: "Bonjour ! Je suis ton tuteur de français. Comment vas-tu aujourd'hui ?",
    suggestions: ["Bonjour ! Je veux pratiquer le français.", "Je voudrais commander un café.", "Peux-tu corriger mes phrases ?"],
    live: {
      debutant: ["Bonjour ! Bienvenue au cours. Comment vous appelez-vous et d'où venez-vous ?", "Bonjour ! Qu'est-ce que vous aimez manger au petit-déjeuner ?", "Bonjour ! Parlez-moi de votre famille. Avec qui habitez-vous ?"],
      intermediaire: ["Bonjour ! Racontez-moi vos dernières vacances. Où êtes-vous allé et qu'avez-vous fait ?", "Bonjour ! Comment se passe votre journée type en semaine ?", "Bonjour ! Décrivez votre meilleur ami. Comment est-il ?"],
      professionnel: ["Bonjour ! Présentez-vous et décrivez votre travail actuel.", "Bonjour ! Racontez-moi un problème que vous avez résolu récemment au travail.", "Bonjour ! Pourquoi voulez-vous améliorer votre français professionnel ?"]
    },
    debutant: [
      { cat: "Salutation", word: "Bonjour, comment allez-vous ?", phon: "/bɔ̃.ʒuʁ kɔ.mɑ̃.t‿a.le vu/", trans: "Hello, how are you?", ex: "Bonjour Madame, comment allez-vous ?" },
      { cat: "Politesse", word: "Merci beaucoup", phon: "/mɛʁ.si bo.ku/", trans: "Thank you very much", ex: "Merci beaucoup pour votre patience." },
      { cat: "Quotidien", word: "Je voudrais un croissant", phon: "/ʒə vu.dʁɛ œ̃ kʁwa.sɑ̃/", trans: "I would like a croissant", ex: "Bonjour, je voudrais un croissant et un café." },
      { cat: "Orientation", word: "Où se trouve le musée ?", phon: "/u sə tʁuv lə my.ze/", trans: "Where is the museum?", ex: "Excusez-moi, où se trouve le musée du Louvre ?" },
      { cat: "Présentation", word: "Enchanté de faire votre connaissance", phon: "/ɑ̃.ʃɑ̃.te də fɛʁ vɔtʁ kɔ.nɛ.sɑ̃s/", trans: "Nice to meet you", ex: "Bonjour, enchanté de faire votre connaissance." },
      { cat: "Aide", word: "Pouvez-vous parler plus lentement ?", phon: "/pu.ve vu paʁ.le ply lɑ̃t.mɑ̃/", trans: "Can you speak more slowly?", ex: "Je débute en français, pouvez-vous parler plus lentement ?" }
    ],
    intermediaire: [
      { cat: "Travail", word: "J'ai hâte de collaborer avec vous", phon: "/ʒe ɑt də kɔ.la.bɔ.ʁe a.vɛk vu/", trans: "I look forward to working with you", ex: "Ce projet est passionnant, j'ai hâte de collaborer avec vous." },
      { cat: "Opinion", word: "À mon avis, c'est la meilleure solution", phon: "/a mɔ̃.n‿a.vi sɛ la mɛ.jœʁ sɔ.ly.sjɔ̃/", trans: "In my opinion, it's the best solution", ex: "À mon avis, c'est la meilleure solution pour l'équipe." },
      { cat: "Expression", word: "Il vaut mieux tard que jamais", phon: "/il vo mjø taʁ kə ʒa.mɛ/", trans: "Better late than never", ex: "Tu as enfin envoyé le dossier : il vaut mieux tard que jamais !" },
      { cat: "Nuance", word: "Cela dépend des circonstances", phon: "/sə.la de.pɑ̃ de siʁ.kɔ̃s.tɑ̃s/", trans: "It depends on the circumstances", ex: "Je ne peux pas répondre tout de suite, cela dépend des circonstances." },
      { cat: "Projet", word: "Je fais des progrès chaque semaine", phon: "/ʒə fɛ de pʁɔ.ɡʁɛ ʃak sə.mɛn/", trans: "I make progress every week", ex: "En pratiquant un peu chaque jour, je fais des progrès chaque semaine." },
      { cat: "Politesse", word: "Auriez-vous l'amabilité de m'aider ?", phon: "/o.ʁje vu l‿a.ma.bi.li.te də m‿e.de/", trans: "Would you be so kind as to help me?", ex: "Pardon de vous déranger, auriez-vous l'amabilité de m'aider ?" }
    ],
    professionnel: [
      { cat: "Email", word: "Veuillez trouver ci-joint le document", phon: "/vœ.je tʁu.ve si.ʒwɛ̃ lə dɔ.ky.mɑ̃/", trans: "Please find the document attached", ex: "Veuillez trouver ci-joint le document demandé." },
      { cat: "Réunion", word: "Pourrions-nous fixer un rendez-vous ?", phon: "/pu.ʁjɔ̃ nu fik.se œ̃ ʁɑ̃.de.vu/", trans: "Could we set up an appointment?", ex: "Pourrions-nous fixer un rendez-vous mardi matin ?" },
      { cat: "Politesse", word: "Je reste à votre disposition", phon: "/ʒə ʁɛst a vɔtʁ dis.pɔ.zi.sjɔ̃/", trans: "I remain at your disposal", ex: "Pour toute question, je reste à votre disposition." },
      { cat: "Projet", word: "Nous devons respecter les délais", phon: "/nu də.vɔ̃ ʁɛs.pɛk.te le de.lɛ/", trans: "We must meet the deadlines", ex: "Nous devons respecter les délais de livraison." },
      { cat: "Recrutement", word: "Je souhaite postuler à ce poste", phon: "/ʒə swɛt pɔs.ty.le a sə pɔst/", trans: "I would like to apply for this position", ex: "Je souhaite postuler à ce poste de responsable." },
      { cat: "Email", word: "Veuillez agréer mes salutations distinguées", phon: "/vœ.je a.ɡʁe.e me sa.ly.ta.sjɔ̃ dis.tɛ̃.ɡe/", trans: "Yours sincerely", ex: "Veuillez agréer, Madame, mes salutations distinguées." }
    ]
  }
};

const GRAMMAR = {
  en: [
    { title: "L'âge avec « to be »", rule: "En anglais, l'âge se dit avec le verbe être (to be), jamais avec avoir.", ex: "I am 25 years old." },
    { title: "Présent simple : he / she / it + s", rule: "À la 3e personne du singulier, on ajoute -s au verbe (have devient has).", ex: "She works in a bank and he has two cats." },
    { title: "Present perfect", rule: "have / has + participe passé : une expérience ou un résultat qui compte maintenant.", ex: "I have visited London three times." },
    { title: "Politesse : could / would", rule: "Pour demander poliment : Could you… ? Would you mind… ? (très utile au travail).", ex: "Could you send me the file, please?" }
  ],
  es: [
    { title: "Ser ou estar ?", rule: "ser = identité, profession, caractère durable ; estar = état temporaire et lieu.", ex: "Soy profesor. Hoy estoy cansado." },
    { title: "L'âge avec « tener »", rule: "En espagnol, l'âge se dit avec tener (avoir).", ex: "Tengo veinticinco años." },
    { title: "Le verbe « gustar »", rule: "me gusta + singulier ; me gustan + pluriel. Le sujet est la chose qui plaît.", ex: "Me gusta el café. Me gustan los libros." },
    { title: "Politesse formelle", rule: "Avec usted, le conditionnel adoucit la demande : ¿Podría… ?", ex: "¿Podría enviarme el informe, por favor?" }
  ],
  it: [
    { title: "Avere pour l'âge et la faim", rule: "En italien, l'âge, la faim, la soif se disent avec avere.", ex: "Ho venticinque anni. Ho fame." },
    { title: "Les articles il / lo / la", rule: "lo devant s + consonne, z, gn ; l' devant voyelle ; il devant les autres consonnes masculines.", ex: "Il libro, lo zaino, l'amica." },
    { title: "Passato prossimo", rule: "avere / essere + participe passé. Les verbes de mouvement prennent essere.", ex: "Ieri sono andato al mercato e ho comprato il pane." },
    { title: "Politesse : le « Lei »", rule: "Pour vouvoyer, on utilise Lei avec la 3e personne du singulier.", ex: "Mi può mandare il documento, per favore?" }
  ],
  fr: [
    { title: "Passé composé", rule: "avoir/être + participe passé. Verbes de mouvement et pronominaux : être.", ex: "Je suis allé au marché et j'ai acheté du pain." },
    { title: "L'âge avec « avoir »", rule: "On dit « J'ai 25 ans » et non « Je suis 25 ans ».", ex: "J'ai vingt-cinq ans." },
    { title: "Accord de l'adjectif", rule: "L'adjectif s'accorde en genre et en nombre avec le nom.", ex: "Une petite maison, des amis contents." },
    { title: "Politesse : le conditionnel", rule: "Le conditionnel adoucit une demande : « Pourriez-vous… ? »", ex: "Pourriez-vous m'envoyer le document, s'il vous plaît ?" }
  ]
};

const LOCAL_RULES = {
  en: [[/\bi am agree\b/i, "On dit « I agree » (sans 'am')."], [/\bi have \d+ years?\b/i, "Pour l'âge : « I am 25 years old »."], [/\b(he|she|it) have\b/i, "3e personne du singulier : « has »."], [/\bmore better\b/i, "« better » suffit (déjà un comparatif)."], [/\bdepends of\b/i, "On dit « depends on »."], [/\blook forward to meet\b/i, "« look forward to meeting » (verbe en -ing)."]],
  es: [[/\bestoy \d+ a[ñn]os\b/i, "Pour l'âge : « tengo 25 años »."], [/\bsoy cansad[oa]\b/i, "État temporaire : « estoy cansado »."], [/\bme gusto\b/i, "On dit « me gusta » / « me gustan »."], [/\bmuy mucho\b/i, "« muy » + adjectif ; « mucho » + nom ou verbe."]],
  it: [[/\bsono \d+ anni\b/i, "Pour l'âge : « ho 25 anni » (avere)."], [/\bsono fame\b/i, "On dit « ho fame » (avere)."], [/\bpiace mi\b/i, "On dit « mi piace »."]],
  fr: [[/\bj'ai allé\b/i, "On dit « je suis allé(e) » (auxiliaire être)."], [/\bje suis \d+ ans\b/i, "On dit « j'ai 25 ans » (avoir)."], [/\bje voudrais de\b/i, "On dit « je voudrais un/une… »."]]
};
const LOCAL_FB = {
  en: ["Good try! Let's continue.", "Nice! Keep going.", "Thank you for your answer."],
  es: ["¡Buen intento! Sigamos.", "¡Muy bien! Continuemos.", "Gracias por tu respuesta."],
  it: ["Bel tentativo! Continuiamo.", "Molto bene! Andiamo avanti.", "Grazie per la risposta."],
  fr: ["Bon essai ! Continuons.", "Très bien ! Poursuivons.", "Merci pour votre réponse."]
};
const LOCAL_SHORT = {
  en: "Try to answer with a full sentence, please.",
  es: "Intenta responder con una frase completa, por favor.",
  it: "Prova a rispondere con una frase completa, per favore.",
  fr: "Essayez de répondre avec une phrase complète, s'il vous plaît."
};

/* =========================================================
   Utilitaires et état
   ========================================================= */
const $ = (id) => document.getElementById(id);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }

/* ---- Cartes générées par l'IA : sauvegardées dans le navigateur ---- */
const CUSTOM_KEY = "lingua_custom_cards_v1";
let customCards = (() => { try { return JSON.parse(lsGet(CUSTOM_KEY)) || {}; } catch (e) { return {}; } })();
function saveCustomCards() { lsSet(CUSTOM_KEY, JSON.stringify(customCards)); }
Object.keys(customCards).forEach((k) => {
  const [lang, level] = k.split("|");
  if (VOCAB_DATA[lang] && VOCAB_DATA[lang][level]) VOCAB_DATA[lang][level].push(...customCards[k]);
});

const prefs = (() => { try { return JSON.parse(lsGet("lingua_prefs")) || {}; } catch (e) { return {}; } })();
let currentLang = VOCAB_DATA[prefs.lang] ? prefs.lang : "en";
let currentLevel = LEVELS[prefs.level] ? prefs.level : "debutant";
function savePrefs() { lsSet("lingua_prefs", JSON.stringify({ lang: currentLang, level: currentLevel })); }
const curList = () => VOCAB_DATA[currentLang][currentLevel];

let cardIndex = 0, slowMode = false;
let quizOrder = [], quizIndex = 0, quizScore = 0, quizAnswered = false, quizRecorded = false;
let chatHistory = [];

/* ---- Progression sauvegardée (avec objectif quotidien) ---- */
const STORE_KEY = "lingua_progress_v2";
function defaultProgress() { return { points: 0, streak: 0, lastDay: "", quizHistory: [], mistakes: {}, liveCorrect: 0, liveTotal: 0, pronCount: 0, pronSum: 0, dailyGoal: 20, dailyPoints: 0, dailyDate: "", history: {} }; }
let progress = (() => { try { const p = JSON.parse(lsGet(STORE_KEY)); if (p && typeof p === "object") return Object.assign(defaultProgress(), p); } catch (e) { /* ignore */ } return defaultProgress(); })();
function saveProgress() { lsSet(STORE_KEY, JSON.stringify(progress)); }
const dayStr = (d) => d.toLocaleDateString("sv-SE");
function touchStreak() {
  const today = dayStr(new Date());
  if (progress.lastDay === today) return;
  progress.streak = progress.lastDay === dayStr(new Date(Date.now() - 864e5)) ? progress.streak + 1 : 1;
  progress.lastDay = today;
}
function addPoints(n) {
  touchStreak();
  progress.points += n;
  const today = dayStr(new Date());
  if (progress.dailyDate !== today) { progress.dailyDate = today; progress.dailyPoints = 0; }
  progress.dailyPoints += n;
  if (!progress.history) progress.history = {};
  progress.history[today] = (progress.history[today] || 0) + n;
  const days = Object.keys(progress.history).sort();
  while (days.length > 60) delete progress.history[days.shift()];
  saveProgress();
  renderScore();
  renderDailyGoal();
}
function renderScore() { $("totalPoints").textContent = progress.points; $("streak").textContent = progress.streak; }
function renderDailyGoal() {
  const today = dayStr(new Date());
  if (progress.dailyDate !== today) { progress.dailyDate = today; progress.dailyPoints = 0; saveProgress(); }
  const pct = Math.min(100, (progress.dailyPoints / progress.dailyGoal) * 100);
  $("goalFill").style.width = pct + "%";
  $("goalText").textContent = progress.dailyPoints + "/" + progress.dailyGoal;
}

/* =========================================================
   Voix (synthèse) et reconnaissance vocale
   ========================================================= */
let voicesCache = [];
function loadVoices() { voicesCache = ("speechSynthesis" in window) ? speechSynthesis.getVoices() : []; }
if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

const FEMALE_RE = /female|femme|woman|zira|hortense|julie|denise|elsa|paulina|helena|sabina|isabella|elena|samantha|aria|jenny|sonia|libby|eloise|vivienne|carmen|alice/i;
const MALE_RE = /\bmale\b|homme|david|mark|paul\b|henri|claude|guy|ryan|diego|pablo|jorge|cosimo|luca|alvaro|antonio|thomas|george|james|richard|remy|conrad/i;
function pickVoice(speechLang, gender) {
  const base = speechLang.slice(0, 2).toLowerCase();
  const list = voicesCache.filter((v) => v.lang.toLowerCase().startsWith(base));
  if (!list.length) return null;
  const exact = list.filter((v) => v.lang.toLowerCase().replace("_", "-") === speechLang.toLowerCase());
  const pool = (exact.length ? exact : list).slice().sort((a, b) => (/natural|online/i.test(b.name) ? 1 : 0) - (/natural|online/i.test(a.name) ? 1 : 0));
  const isF = (v) => FEMALE_RE.test(v.name);
  const isM = (v) => !isF(v) && MALE_RE.test(v.name);
  if (gender === "female") return pool.find(isF) || pool[0];
  if (gender === "male") return pool.find(isM) || pool.find((v) => !isF(v)) || pool[0];
  return pool[0];
}

const AVATARS = {
  femme: { name: "Sarah", role: "Professeure IA", gender: "female", pitch: 1.05 },
  homme: { name: "James", role: "Professeur IA", gender: "male", pitch: 0.95 },
  robot: { name: "Robo", role: "Professeur robot", gender: "neutral", pitch: 0.6 }
};
let avatarId = AVATARS[lsGet("lingua_avatar")] ? lsGet("lingua_avatar") : "femme";

let speakToken = 0;
function speak(text, opts = {}) {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window) || !text) { resolve(); return; }
    const my = ++speakToken;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const lang = opts.lang || VOCAB_DATA[currentLang].speechLang;
    const av = AVATARS[avatarId];
    u.lang = lang;
    const v = pickVoice(lang, av.gender);
    if (v) u.voice = v;
    u.rate = slowMode ? 0.7 : 0.95;
    u.pitch = av.pitch;
    let done = false, timer = null;
    const finish = () => {
      if (done) return; done = true; clearTimeout(timer);
      if (opts.avatar && my === speakToken) setAvatarSpeaking(false);
      resolve();
    };
    timer = setTimeout(finish, Math.max(4000, text.length * (slowMode ? 150 : 110) + 3000));
    u.onstart = () => { if (opts.avatar && my === speakToken) setAvatarSpeaking(true); };
    u.onend = finish;
    u.onerror = finish;
    speechSynthesis.speak(u);
  });
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function srErrorText(code) {
  const m = { "not-allowed": "Accès au micro refusé : autorise-le dans Chrome (icône cadenas).", "service-not-allowed": "Reconnaissance vocale bloquée par le navigateur.", "no-speech": "Je n'ai rien entendu.", "audio-capture": "Aucun micro détecté.", "network": "La reconnaissance vocale de Chrome a besoin d'internet." };
  return m[code] || ("Erreur micro (" + code + ").");
}
function listenOnce(lang, cb) {
  const rec = new SR();
  rec.lang = lang; rec.interimResults = false; rec.maxAlternatives = 1; rec.continuous = false;
  let got = false;
  rec.onresult = (e) => { got = true; cb.onResult(e.results[0][0].transcript); };
  rec.onerror = (e) => { if (cb.onError) cb.onError(e.error); };
  rec.onend = () => { if (cb.onEnd) cb.onEnd(got); };
  try { rec.start(); } catch (err) { if (cb.onError) cb.onError(String(err.message || err)); }
  return rec;
}

/* =========================================================
   IA (via le proxy du serveur : la clé reste côté serveur)
   ========================================================= */
let serverAI = false;
const aiEnabled = () => serverAI;

async function callLLM(messages, jsonMode = false) {
  const body = { messages, temperature: 0.5 };
  if (jsonMode) body.response_format = { type: "json_object" };
  const res = await fetch(API_BASE + "/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { const e = await res.json(); msg = (e.error && e.error.message) || msg; } catch (e) { /* ignore */ }
    throw new Error("API " + res.status + " : " + msg);
  }
  const data = await res.json();
  return ((data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "").trim();
}

function refreshModeLabels() {
  const on = aiEnabled();
  for (const id of ["chatMode", "liveMode"]) {
    const el = $(id);
    el.className = "mode-pill " + (on ? "on" : "off");
    el.textContent = on ? "🟢 IA active : vraies corrections" : "🟡 Mode local : corrections limitées (IA indisponible)";
  }
}
/* Vérifie si l'IA répond. Render gratuit peut mettre ~50 s à se réveiller : on réessaie. */
let aiChecking = false;
async function checkAI(retries = 6) {
  if (aiChecking || serverAI) return;
  aiChecking = true;
  for (let i = 0; i < retries && !serverAI; i++) {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 15000);
      const r = await fetch(API_BASE + "/api/status", { signal: ctl.signal });
      clearTimeout(t);
      const d = await r.json();
      serverAI = !!d.ai;
      if (serverAI) break;
    } catch (e) { /* serveur en train de se réveiller */ }
    refreshModeLabels();
    await new Promise((ok) => setTimeout(ok, 4000));
  }
  aiChecking = false;
  refreshModeLabels();
}
refreshModeLabels();
checkAI();
/* =========================================================
   Navigation, langue, niveau
   ========================================================= */
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    $(btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "progress") renderProgress();
    if ((btn.dataset.tab === "tutor" || btn.dataset.tab === "liveTutor") && !serverAI) checkAI(3);
    if (btn.dataset.tab === "exercises") renderExercise();
  });
});

$("langSelect").value = currentLang;
$("levelSelect").value = currentLevel;
/* ---- Sélecteur de langue avec drapeaux ---- */
const FLAGS = {
  en: { code: "gb", label: "Anglais (English)" },
  es: { code: "es", label: "Espagnol (Español)" },
  it: { code: "it", label: "Italien (Italiano)" },
  fr: { code: "fr", label: "Français (Français)" }
};
const flagUrl = (lang) => "https://flagcdn.com/w40/" + FLAGS[lang].code + ".png";

function renderLangPicker() {
  const f = FLAGS[currentLang];
  $("langFlag").src = flagUrl(currentLang);
  $("langFlag").alt = f.code.toUpperCase();
  $("langLabel").textContent = f.label;
  const menu = $("langMenu"); menu.innerHTML = "";
  Object.keys(FLAGS).forEach((lang) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    if (lang === currentLang) li.className = "active";
    const img = document.createElement("img");
    img.className = "flag"; img.src = flagUrl(lang); img.alt = FLAGS[lang].code.toUpperCase();
    const span = document.createElement("span"); span.textContent = FLAGS[lang].label;
    li.append(img, span);
    li.addEventListener("click", () => {
      menu.classList.add("hidden");
      if (lang === currentLang) return;
      $("langSelect").value = lang;
      $("langSelect").dispatchEvent(new Event("change"));
    });
    menu.appendChild(li);
  });
}
$("langBtn").addEventListener("click", (e) => { e.stopPropagation(); $("langMenu").classList.toggle("hidden"); });
document.addEventListener("click", () => $("langMenu").classList.add("hidden"));
renderLangPicker();
$("langSelect").addEventListener("change", (e) => {
  currentLang = e.target.value;
  savePrefs();
  renderLangPicker();
  resetAll();
});
$("levelSelect").addEventListener("change", (e) => { currentLevel = e.target.value; savePrefs(); resetAll(); });

function resetAll() {
  if (live.active) endLive();
  cardIndex = 0; pronIndex = 0;
  reviewQueue = [];
  resetQuizState();
  renderFlashcard(); renderQuiz(); renderGrammar(); initTutor(); renderPron(); renderProgress();
  exerciseState = { type: "fill", index: 0 };
  document.querySelectorAll(".ex-tab").forEach((t) => t.classList.toggle("active", t.dataset.ex === "fill"));
  renderExercise();
}

/* =========================================================
   Cartes mémoire & révision espacée
   ========================================================= */
const SR_KEY = "lingua_sr_v1";
let srData = (() => { try { return JSON.parse(lsGet(SR_KEY)) || {}; } catch (e) { return {}; } })();
function saveSR() { lsSet(SR_KEY, JSON.stringify(srData)); }
const srKey = (lang, level, idx) => lang + "|" + level + "|" + idx;
function srGet(lang, level, idx) {
  const k = srKey(lang, level, idx);
  if (!srData[k]) srData[k] = { interval: 0, nextReview: 0, ease: 2.5 };
  return srData[k];
}
function srUpdate(lang, level, idx, quality) {
  const s = srGet(lang, level, idx);
  if (quality >= 3) {
    if (s.interval === 0) s.interval = 1;
    else if (s.interval === 1) s.interval = 3;
    else s.interval = Math.round(s.interval * s.ease);
    s.ease = Math.max(1.3, s.ease + (0.1 - (5 - quality) * 0.08));
  } else {
    s.interval = 0;
    s.ease = Math.max(1.3, s.ease - 0.2);
  }
  s.nextReview = Date.now() + s.interval * 864e5;
  saveSR();
}
function getReviewCards() {
  const now = Date.now();
  const list = curList();
  const due = [];
  for (let i = 0; i < list.length; i++) {
    const s = srGet(currentLang, currentLevel, i);
    if (s.nextReview <= now) due.push(i);
  }
  return due.length ? due : list.map((_, i) => i);
}
let reviewQueue = [];
function renderFlashcard() {
  if (!reviewQueue.length) reviewQueue = getReviewCards();
  if (cardIndex >= reviewQueue.length) cardIndex = 0;
  const idx = reviewQueue[cardIndex];
  const list = curList(), item = list[idx];
  $("flashcard").classList.remove("flipped");
  $("cardCounter").textContent = "Carte " + (cardIndex + 1) + " / " + reviewQueue.length + " (révision espacée)";
  $("cardCategory").textContent = item.cat;
  $("cardWord").textContent = item.word;
  $("cardPhonetic").textContent = item.phon;
  $("cardTranslation").textContent = item.trans;
  $("cardExample").textContent = "Ex : " + item.ex;
}
$("flashcard").addEventListener("click", (e) => { if (e.target.id === "speakCardBtn") return; $("flashcard").classList.toggle("flipped"); });
$("speakCardBtn").addEventListener("click", (e) => { e.stopPropagation(); const idx = reviewQueue[cardIndex]; speak(curList()[idx].word); });
$("prevCardBtn").addEventListener("click", () => { cardIndex = (cardIndex - 1 + reviewQueue.length) % reviewQueue.length; renderFlashcard(); });
$("nextCardBtn").addEventListener("click", () => { cardIndex = (cardIndex + 1) % reviewQueue.length; renderFlashcard(); });
function setSlow(v) { slowMode = !!v; $("slowBtn").textContent = "🐢 Lent : " + (slowMode ? "oui" : "non"); $("pronSlow").checked = slowMode; }
$("slowBtn").addEventListener("click", () => setSlow(!slowMode));
$("pronSlow").addEventListener("change", (e) => setSlow(e.target.checked));
const mistakeKey = (idx) => currentLang + "|" + currentLevel + "|" + idx;
$("knowBtn").addEventListener("click", () => {
  const idx = reviewQueue[cardIndex];
  srUpdate(currentLang, currentLevel, idx, 5);
  delete progress.mistakes[mistakeKey(idx)];
  addPoints(1);
  $("nextCardBtn").click();
});
$("reviewBtn").addEventListener("click", () => {
  const idx = reviewQueue[cardIndex];
  srUpdate(currentLang, currentLevel, idx, 2);
  const k = mistakeKey(idx); progress.mistakes[k] = (progress.mistakes[k] || 0) + 1;
  saveProgress();
  $("nextCardBtn").click();
});

/* ---- Génération de cartes IA ---- */
$("genCardsBtn").addEventListener("click", async () => {
  if (!aiEnabled()) { alert("L'IA n'est pas disponible : la clé GROQ_API_KEY n'est pas définie côté serveur."); return; }
  const theme = prompt("Thème des nouvelles cartes (ex: voyage, cuisine, travail) :", "voyage");
  if (!theme) return;
  $("genCardsBtn").disabled = true; $("genCardsBtn").textContent = "✨ Génération…";
  try {
    const langName = VOCAB_DATA[currentLang].name;
    const request = `Génère exactement 10 cartes de vocabulaire en ${langName} pour un niveau ${LEVELS[currentLevel]}, sur le thème "${theme}". Chaque carte doit avoir : "word" (le mot ou l'expression en ${langName}), "phon" (prononciation API), "trans" (traduction en français), "ex" (une phrase d'exemple en ${langName}), "cat" (catégorie courte). Réponds UNIQUEMENT avec un tableau JSON valide, sans texte autour : [{"word":"...","phon":"...","trans":"...","ex":"...","cat":"..."}]`;
    const raw = await callLLM([{ role: "user", content: request }]);
    const m = raw.match(/\[[\s\S]*\]/);
    if (!m) throw new Error("Réponse IA invalide.");
    const cards = JSON.parse(m[0]);
    if (!Array.isArray(cards) || !cards.length) throw new Error("Aucune carte générée.");

    const list = curList();
    const known = new Set(list.map((c) => c.word.toLowerCase()));
    const fresh = [];
    cards.forEach((c) => {
      if (!c.word || !c.trans) return;
      const w = String(c.word);
      if (known.has(w.toLowerCase())) return;
      known.add(w.toLowerCase());
      fresh.push({ cat: c.cat || theme, word: w, phon: c.phon || "", trans: String(c.trans), ex: c.ex || "" });
    });
    if (!fresh.length) throw new Error("Toutes ces cartes existent déjà.");

    list.push(...fresh);
    const key = currentLang + "|" + currentLevel;
    customCards[key] = (customCards[key] || []).concat(fresh);
    saveCustomCards();

    reviewQueue = getReviewCards();
    renderFlashcard();
    resetQuizState(); renderQuiz();
    alert("✅ " + fresh.length + " cartes ajoutées et sauvegardées !");
  } catch (e) {
    alert("❌ Erreur : " + e.message);
  } finally {
    $("genCardsBtn").disabled = false; $("genCardsBtn").textContent = "✨ Générer 10 cartes IA";
  }
});

/* =========================================================
   Grammaire
   ========================================================= */
function renderGrammar() {
  const box = $("grammarList"); box.innerHTML = "";
  GRAMMAR[currentLang].forEach((g) => {
    const card = document.createElement("div"); card.className = "grammar-card";
    const h = document.createElement("h4"); h.textContent = g.title;
    const p = document.createElement("p"); p.textContent = g.rule;
    const ex = document.createElement("div"); ex.className = "grammar-ex";
    const t = document.createElement("span"); t.textContent = g.ex;
    const b = document.createElement("button"); b.type = "button"; b.textContent = "🔊"; b.title = "Écouter";
    b.addEventListener("click", () => speak(g.ex));
    ex.append(t, b); card.append(h, p, ex); box.appendChild(card);
  });
}

/* =========================================================
   Quiz
   ========================================================= */
function resetQuizState() { quizOrder = shuffle(curList().map((_, i) => i)); quizIndex = 0; quizScore = 0; quizAnswered = false; quizRecorded = false; }
function bestScore() {
  return progress.quizHistory.filter((h) => h.lang === currentLang && h.level === currentLevel).reduce((m, h) => Math.max(m, h.score), 0);
}
function renderQuiz() {
  const list = curList(), opts = $("quizOptions");
  $("nextQuizBtn").classList.add("hidden"); $("quizFeedback").textContent = ""; quizAnswered = false;
  $("bestScore").textContent = bestScore();
  if (quizIndex >= list.length) {
    if (!quizRecorded) {
      quizRecorded = true;
      progress.quizHistory.push({ date: dayStr(new Date()), lang: currentLang, level: currentLevel, score: quizScore, total: list.length });
      progress.quizHistory = progress.quizHistory.slice(-30);
      saveProgress(); $("bestScore").textContent = bestScore();
    }
    $("quizProgress").textContent = "Terminé !";
    $("quizBar").style.width = "100%";
    $("quizQuestion").textContent = "Score final : " + quizScore + " / " + list.length + " 🎉";
    opts.innerHTML = "";
    const again = document.createElement("button"); again.className = "btn primary"; again.textContent = "Recommencer le quiz";
    again.addEventListener("click", () => { resetQuizState(); renderQuiz(); });
    opts.appendChild(again);
    return;
  }
  const idx = quizOrder[quizIndex], item = list[idx];
  $("quizProgress").textContent = "Question " + (quizIndex + 1) + " / " + list.length;
  $("quizScore").textContent = quizScore;
  $("quizBar").style.width = (quizIndex / list.length * 100) + "%";
  const listen = $("listenMode").checked;
  $("quizQuestion").textContent = listen ? "🎧 Écoute et choisis la bonne traduction" : item.word;
  if (listen) speak(item.word);
  const others = shuffle(list.filter((_, i) => i !== idx).map((x) => x.trans)).slice(0, 3);
  const choices = shuffle(others.concat(item.trans));
  opts.innerHTML = "";
  choices.forEach((c) => {
    const b = document.createElement("button"); b.className = "option-btn"; b.textContent = c;
    b.addEventListener("click", () => handleQuizAnswer(b, c === item.trans, item.trans, idx));
    opts.appendChild(b);
  });
}
function handleQuizAnswer(btn, ok, correct, idx) {
  if (quizAnswered) return; quizAnswered = true;
  document.querySelectorAll(".option-btn").forEach((b) => { b.disabled = true; if (b.textContent === correct) b.classList.add("correct"); });
  const fb = $("quizFeedback");
  if (ok) {
    quizScore++; $("quizScore").textContent = quizScore; addPoints(2);
    srUpdate(currentLang, currentLevel, idx, 5);
    delete progress.mistakes[mistakeKey(idx)];
    fb.style.color = "#34d399"; fb.textContent = "✅ Exact ! +2 pts";
  } else {
    btn.classList.add("wrong");
    srUpdate(currentLang, currentLevel, idx, 2);
    const k = mistakeKey(idx); progress.mistakes[k] = (progress.mistakes[k] || 0) + 1; saveProgress();
    fb.style.color = "#f87171"; fb.textContent = "❌ La bonne réponse était : « " + correct + " »";
  }
  $("nextQuizBtn").classList.remove("hidden");
}
$("nextQuizBtn").addEventListener("click", () => { quizIndex++; renderQuiz(); });
$("speakQuizBtn").addEventListener("click", () => { if (quizIndex < curList().length) speak(curList()[quizOrder[quizIndex]].word); });
$("listenMode").addEventListener("change", () => { if (!quizAnswered) renderQuiz(); });

/* =========================================================
   Répète après moi (prononciation)
   ========================================================= */
let pronIndex = 0, pronRec = null;
const pronBest = {};
function pronTier(s) { return s >= 85 ? 5 : s >= 60 ? 2 : 0; }

function subWords(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’`]/g, "").replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);
}
function lev(a, b) {
  const m = a.length, n = b.length;
  let prev = [];
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
function wordsMatch(a, b) { return a === b || (Math.min(a.length, b.length) >= 5 && lev(a, b) <= 1); }
function compareSpeech(targetText, heardText) {
  const tokens = targetText.split(/\s+/).filter(Boolean);
  const flat = [], owner = [];
  tokens.forEach((t, ti) => subWords(t).forEach((w) => { flat.push(w); owner.push(ti); }));
  const heard = subWords(heardText);
  const n = flat.length, m = heard.length;
  const dp = [];
  for (let i = 0; i <= n; i++) dp.push(new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], wordsMatch(flat[i - 1], heard[j - 1]) ? dp[i - 1][j - 1] + 1 : 0);
  }
  const ok = new Array(n).fill(false);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (wordsMatch(flat[i - 1], heard[j - 1]) && dp[i][j] === dp[i - 1][j - 1] + 1) { ok[i - 1] = true; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  const tokOk = tokens.map(() => null);
  flat.forEach((w, k) => { const ti = owner[k]; tokOk[ti] = (tokOk[ti] === null ? true : tokOk[ti]) && ok[k]; });
  const matched = ok.filter(Boolean).length;
  return { score: n ? Math.round(matched / n * 100) : 0, tokens: tokens.map((t, ti) => ({ text: t, ok: tokOk[ti] })) };
}

function stopSpeaking() { speakToken++; if ("speechSynthesis" in window) speechSynthesis.cancel(); }
function stopPronRec() {
  try { if (pronRec) pronRec.abort(); } catch (e) { /* ignore */ }
  pronRec = null; $("pronMicBtn").classList.remove("mic-recording");
}
function renderPron() {
  stopPronRec();
  const list = curList(), it = list[pronIndex];
  $("pronCounter").textContent = "Phrase " + (pronIndex + 1) + " / " + list.length;
  $("pronCat").textContent = it.cat;
  $("pronTarget").textContent = it.word;
  $("pronPhon").textContent = it.phon;
  $("pronTrans").textContent = it.trans;
  $("pronResult").classList.add("hidden");
  $("pronInput").value = "";
  $("pronMicBtn").disabled = !SR;
  $("pronStatus").textContent = SR ? "Clique sur « Je répète » et parle." : "Micro indisponible dans ce navigateur (utilise Chrome ou Edge). Tu peux écrire la phrase de mémoire ci-dessous.";
}
function evaluatePron(text, typed) {
  const it = curList()[pronIndex];
  const r = compareSpeech(it.word, text), score = r.score;
  $("pronScore").textContent = score + " %";
  const box = $("pronScoreBox"); box.className = "pron-score " + (score >= 85 ? "good" : score >= 60 ? "mid" : "low");
  $("pronVerdict").textContent = score >= 85 ? "Excellent !" : score >= 60 ? "Pas mal, continue !" : "Essaie encore.";
  const wordsBox = $("pronWords"); wordsBox.innerHTML = "";
  r.tokens.forEach((t) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "w " + (t.ok ? "ok" : "miss"); b.textContent = t.text;
    b.addEventListener("click", () => speak(t.text));
    wordsBox.appendChild(b);
    wordsBox.appendChild(document.createTextNode(" "));
  });
  $("pronHeard").textContent = "Entendu : " + text;
  $("pronResult").classList.remove("hidden");
  const key = currentLang + "|" + currentLevel + "|" + pronIndex;
  pronBest[key] = Math.max(pronBest[key] || 0, score);
  if (score >= 60) { addPoints(score >= 85 ? 3 : 1); }
  srUpdate(currentLang, currentLevel, pronIndex, pronTier(score));
  progress.pronCount = (progress.pronCount || 0) + 1;
  progress.pronSum = (progress.pronSum || 0) + score;
  saveProgress();
  if (typed) $("pronStatus").textContent = "Mode écrit : la comparaison est indicative.";
}
$("pronListenBtn").addEventListener("click", () => speak(curList()[pronIndex].word));
$("pronMicBtn").addEventListener("click", () => {
  if (!SR) return;
  stopSpeaking();
  stopPronRec();
  $("pronStatus").textContent = "🎤 Parle maintenant…";
  $("pronMicBtn").classList.add("mic-recording");
  pronRec = listenOnce(VOCAB_DATA[currentLang].speechLang, {
    onResult: (txt) => { stopPronRec(); $("pronStatus").textContent = ""; evaluatePron(txt, false); },
    onError: (err) => { stopPronRec(); if (err !== "aborted") $("pronStatus").textContent = srErrorText(err); },
    onEnd: () => { stopPronRec(); }
  });
});
$("pronForm").addEventListener("submit", (e) => { e.preventDefault(); const v = $("pronInput").value.trim(); if (v) evaluatePron(v, true); });
$("pronPrevBtn").addEventListener("click", () => { pronIndex = (pronIndex - 1 + curList().length) % curList().length; renderPron(); });
$("pronNextBtn").addEventListener("click", () => { pronIndex = (pronIndex + 1) % curList().length; renderPron(); });

/* =========================================================
   Exercices
   ========================================================= */
let exerciseState = { type: "fill", index: 0 };
document.querySelectorAll(".ex-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".ex-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    exerciseState = { type: tab.dataset.ex, index: 0 };
    renderExercise();
  });
});
$("nextExBtn").addEventListener("click", () => { exerciseState.index++; renderExercise(); });

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿¡.,!?;:'’"«»]/g, "").replace(/\s+/g, " ").trim();

function renderExercise() {
  const box = $("exerciseContent"); box.innerHTML = "";
  const list = curList();
  const item = list[exerciseState.index % list.length];
  if (exerciseState.type === "fill") {
    const sentence = item.ex || item.word;
    const words = sentence.split(" ");
    const pos = Math.min(words.length - 1, Math.max(1, Math.floor(words.length / 2)));
    const target = words[pos];
    const masked = words.map((w, i) => (i === pos ? "_____" : w)).join(" ");
    const p = document.createElement("p"); p.textContent = masked;
    const input = document.createElement("input"); input.type = "text"; input.placeholder = "Mot manquant…";
    const btn = document.createElement("button"); btn.className = "btn primary"; btn.textContent = "Vérifier";
    const fb = document.createElement("p"); fb.className = "exercise-feedback";
    btn.addEventListener("click", () => {
      const ok = norm(input.value) === norm(target);
      fb.textContent = ok ? "✅ Bravo !" : "❌ La réponse était : " + target;
      fb.className = "exercise-feedback " + (ok ? "ok" : "err");
      if (ok) addPoints(2);
    });
    box.append(p, input, btn, fb);
  } else if (exerciseState.type === "order") {
    const words = item.word.split(" ");
    const shuffled = shuffle(words);
    const result = document.createElement("div"); result.className = "order-result";
    const bank = document.createElement("div"); bank.className = "word-bank";
    const fb = document.createElement("p"); fb.className = "exercise-feedback";
    shuffled.forEach((w) => {
      const b = document.createElement("button"); b.textContent = w;
      b.addEventListener("click", () => {
        if (b.classList.contains("used")) return;
        b.classList.add("used");
        const s = document.createElement("span"); s.textContent = w;
        s.addEventListener("click", () => { s.remove(); b.classList.remove("used"); });
        result.appendChild(s);
      });
      bank.appendChild(b);
    });
    const btn = document.createElement("button"); btn.className = "btn primary"; btn.textContent = "Vérifier";
    btn.addEventListener("click", () => {
      const answer = Array.from(result.children).map((s) => s.textContent).join(" ");
      const ok = norm(answer) === norm(item.word);
      fb.textContent = ok ? "✅ Parfait !" : "❌ La bonne phrase : " + item.word;
      fb.className = "exercise-feedback " + (ok ? "ok" : "err");
      if (ok) addPoints(2);
    });
    const p = document.createElement("p"); p.textContent = "Remets les mots dans l'ordre :";
    box.append(p, bank, result, btn, fb);
  } else {
    const p = document.createElement("p"); p.textContent = "Écoute la phrase et écris-la :";
    const btnPlay = document.createElement("button"); btnPlay.className = "btn secondary"; btnPlay.textContent = "🔊 Écouter";
    btnPlay.addEventListener("click", () => speak(item.word));
    const input = document.createElement("input"); input.type = "text"; input.placeholder = "Écris ce que tu entends…";
    const btn = document.createElement("button"); btn.className = "btn primary"; btn.textContent = "Vérifier";
    const fb = document.createElement("p"); fb.className = "exercise-feedback";
    btn.addEventListener("click", () => {
      const ok = norm(input.value) === norm(item.word);
      fb.textContent = ok ? "✅ Excellent !" : "❌ La phrase était : " + item.word;
      fb.className = "exercise-feedback " + (ok ? "ok" : "err");
      if (ok) addPoints(2);
    });
    box.append(p, btnPlay, input, btn, fb);
  }
}

/* =========================================================
   Chat IA (tuteur)
   ========================================================= */
function renderTutorGreeting() {
  chatHistory = [{ role: "assistant", content: VOCAB_DATA[currentLang].greeting }];
  const win = $("chatWindow"); win.innerHTML = "";
  addChatMsg("ai", VOCAB_DATA[currentLang].greeting);
  const qp = $("quickPrompts"); qp.innerHTML = "";
  VOCAB_DATA[currentLang].suggestions.forEach((s) => {
    const chip = document.createElement("button"); chip.className = "chip"; chip.textContent = s;
    chip.addEventListener("click", () => { $("chatInput").value = s; $("chatForm").requestSubmit(); });
    qp.appendChild(chip);
  });
}
function addChatMsg(who, text, extra) {
  const win = $("chatWindow");
  const d = document.createElement("div"); d.className = "msg " + who;
  d.textContent = text;
  if (extra) {
    const corr = document.createElement("span"); corr.className = "correction"; corr.textContent = extra;
    d.appendChild(corr);
  }
  if (who === "ai") {
    const b = document.createElement("button"); b.className = "speak-mini"; b.textContent = "🔊 Écouter";
    b.addEventListener("click", () => speak(text));
    d.appendChild(b);
  }
  win.appendChild(d);
  win.scrollTop = win.scrollHeight;
}
function initTutor() { renderTutorGreeting(); }

$("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = $("chatInput");
  const text = input.value.trim(); if (!text) return;
  input.value = "";
  addChatMsg("user", text);
  chatHistory.push({ role: "user", content: text });

  if (!aiEnabled()) {
    const fb = pick(LOCAL_FB[currentLang]);
    addChatMsg("ai", fb + " " + pick(VOCAB_DATA[currentLang].live[currentLevel]), localCorrection(text));
    chatHistory.push({ role: "assistant", content: fb });
    return;
  }
  try {
    const sys = `Tu es un tuteur de ${VOCAB_DATA[currentLang].name} pour un apprenant de niveau ${LEVELS[currentLevel]}. Réponds dans la langue cible, corrige les fautes de l'apprenant dans une section « Correction : » en français, et propose une suite naturelle. Sois bienveillant et concis.`;
    const messages = [{ role: "system", content: sys }, ...chatHistory.slice(-10)];
    const reply = await callLLM(messages);
    addChatMsg("ai", reply);
    chatHistory.push({ role: "assistant", content: reply });
    speak(reply.split("\n")[0]);
  } catch (err) {
    addChatMsg("ai", "⚠️ " + err.message);
  }
});

if (SR) {
  let chatRec = null;
  $("micBtn").addEventListener("click", () => {
    if (chatRec) { try { chatRec.abort(); } catch (e) {} chatRec = null; $("micBtn").classList.remove("mic-recording"); return; }
    $("micBtn").classList.add("mic-recording");
    chatRec = listenOnce(VOCAB_DATA[currentLang].speechLang, {
      onResult: (txt) => { $("chatInput").value = txt; $("chatForm").requestSubmit(); },
      onError: (err) => { if (err !== "aborted") $("chatInput").placeholder = srErrorText(err); },
      onEnd: () => { chatRec = null; $("micBtn").classList.remove("mic-recording"); }
    });
  });
}

/* =========================================================
   Face-à-face (cours en direct, avec scénarios)
   ========================================================= */
const live = { active: false, busy: false, listening: false, rec: null, history: [], lastQuestion: "", correct: 0, total: 0, scenario: "libre" };
let mediaStream = null;
let sessionErrors = [];
let mouthTimer = null;

/* ---- Corrections locales (quand l'IA est indisponible) ---- */
function localCorrection(text) {
  const rules = LOCAL_RULES[currentLang] || [];
  for (const [re, msg] of rules) if (re.test(text)) return "💡 " + msg;
  return "";
}

/* ---- Scénarios de jeu de rôle ---- */
const SCENARIOS = {
  libre: { role: "" },
  restaurant: {
    role: "un serveur dans un restaurant (l'élève est le client qui réserve, commande et paie)",
    lines: {
      en: ["Good evening! Welcome to our restaurant. Do you have a reservation?", "Perfect, please follow me. What would you like to eat tonight?", "Would you like something to drink with your meal?"],
      es: ["¡Buenas noches! Bienvenido a nuestro restaurante. ¿Tiene una reserva?", "Perfecto, sígame, por favor. ¿Qué le gustaría comer esta noche?", "¿Desea algo de beber con la comida?"],
      it: ["Buonasera! Benvenuto nel nostro ristorante. Ha una prenotazione?", "Perfetto, mi segua, per favore. Cosa desidera mangiare stasera?", "Desidera qualcosa da bere con il pasto?"],
      fr: ["Bonsoir ! Bienvenue dans notre restaurant. Avez-vous une réservation ?", "Parfait, suivez-moi, s'il vous plaît. Que souhaitez-vous manger ce soir ?", "Désirez-vous une boisson avec votre repas ?"]
    }
  },
  aeroport: {
    role: "un agent d'enregistrement à l'aéroport (l'élève est un passager qui voyage)",
    lines: {
      en: ["Good morning! Welcome to the check-in desk. May I see your passport, please?", "Thank you. Where are you flying to today?", "Do you have any luggage to check in?"],
      es: ["¡Buenos días! Bienvenido al mostrador de facturación. ¿Me enseña su pasaporte, por favor?", "Gracias. ¿A dónde viaja hoy?", "¿Tiene equipaje para facturar?"],
      it: ["Buongiorno! Benvenuto al banco del check-in. Mi mostra il passaporto, per favore?", "Grazie. Dove viaggia oggi?", "Ha dei bagagli da imbarcare?"],
      fr: ["Bonjour ! Bienvenue au comptoir d'enregistrement. Puis-je voir votre passeport, s'il vous plaît ?", "Merci. Où voyagez-vous aujourd'hui ?", "Avez-vous des bagages à enregistrer ?"]
    }
  },
  entretien: {
    role: "un recruteur qui mène un entretien d'embauche (l'élève est le candidat)",
    lines: {
      en: ["Good morning, and thank you for coming. Could you introduce yourself, please?", "Interesting. Why do you want to work for our company?", "What is your greatest strength?"],
      es: ["Buenos días, gracias por venir. ¿Puede presentarse, por favor?", "Interesante. ¿Por qué quiere trabajar en nuestra empresa?", "¿Cuál es su mayor fortaleza?"],
      it: ["Buongiorno, grazie per essere venuto. Può presentarsi, per favore?", "Interessante. Perché vuole lavorare nella nostra azienda?", "Qual è il suo più grande punto di forza?"],
      fr: ["Bonjour, merci d'être venu. Pouvez-vous vous présenter, s'il vous plaît ?", "Intéressant. Pourquoi voulez-vous travailler dans notre entreprise ?", "Quelle est votre plus grande qualité ?"]
    }
  },
  support: {
    role: "un technicien du support informatique (l'élève est un utilisateur qui a un problème avec son ordinateur)",
    lines: {
      en: ["Hello, technical support speaking. How can I help you today?", "I see. When did the problem start?", "Have you tried restarting your computer?"],
      es: ["Hola, soporte técnico al habla. ¿En qué puedo ayudarle hoy?", "Entiendo. ¿Cuándo empezó el problema?", "¿Ha intentado reiniciar su ordenador?"],
      it: ["Buongiorno, assistenza tecnica. Come posso aiutarla oggi?", "Capisco. Quando è iniziato il problema?", "Ha provato a riavviare il computer?"],
      fr: ["Bonjour, support technique à l'appareil. Comment puis-je vous aider aujourd'hui ?", "Je vois. Quand le problème a-t-il commencé ?", "Avez-vous essayé de redémarrer votre ordinateur ?"]
    }
  }
};
function scenarioLines() { const s = SCENARIOS[live.scenario]; return s && s.lines ? s.lines[currentLang] : null; }
function nextLocalQuestion() { const sl = scenarioLines(); return sl ? pick(sl.slice(1)) : pick(VOCAB_DATA[currentLang].live[currentLevel]); }
function scenarioRoleText() {
  const s = SCENARIOS[live.scenario];
  return s && s.role ? " Jeu de rôle : tu joues le rôle suivant : " + s.role + ". Reste dans ce rôle, parle comme dans cette situation réelle et pose une question adaptée à ce contexte." : "";
}

/* ---- Avatars (SVG intégrés) ---- */
function faceSVG(o) {
  return '<svg viewBox="0 0 200 220" class="avatar-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    (o.back || "") +
    '<path d="M25 220 Q30 168 100 162 Q170 168 175 220Z" fill="' + o.shirt + '"/>' +
    '<path d="M82 150 h36 v26 q-18 14 -36 0z" fill="' + o.shade + '"/>' +
    '<ellipse cx="52" cy="98" rx="7" ry="12" fill="' + o.skin + '"/><ellipse cx="148" cy="98" rx="7" ry="12" fill="' + o.skin + '"/>' +
    '<ellipse cx="100" cy="96" rx="47" ry="57" fill="' + o.skin + '"/>' +
    (o.front || "") +
    '<g class="eyes"><ellipse cx="80" cy="98" rx="8" ry="5.5" fill="#fff"/><circle cx="80" cy="98" r="3.6" fill="' + o.eye + '"/>' +
    '<ellipse cx="120" cy="98" rx="8" ry="5.5" fill="#fff"/><circle cx="120" cy="98" r="3.6" fill="' + o.eye + '"/></g>' +
    '<path d="M70 86 Q80 81 90 85" stroke="' + o.hair + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M110 85 Q120 81 130 86" stroke="' + o.hair + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M100 102 Q95 120 103 122" stroke="' + o.shade + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="68" cy="118" rx="9" ry="5" fill="#f4a0a0" opacity=".25"/><ellipse cx="132" cy="118" rx="9" ry="5" fill="#f4a0a0" opacity=".25"/>' +
    '<ellipse class="mouth" cx="100" cy="140" rx="12" ry="2.6" fill="' + o.mouth + '"/>' +
    (o.extra || "") + '</svg>';
}
const AVATAR_SVGS = {
  femme: faceSVG({
    skin: "#f1c9a5", shade: "#dba982", hair: "#4a2c1d", shirt: "#6d28d9", mouth: "#b3394f", eye: "#5b3a29",
    back: '<path d="M46 98 Q38 22 100 26 Q162 22 154 98 L160 176 Q100 192 40 176Z" fill="#4a2c1d"/>',
    front: '<path d="M52 88 Q58 36 100 38 Q142 36 148 88 Q124 62 100 60 Q76 62 52 88Z" fill="#4a2c1d"/>'
  }),
  homme: faceSVG({
    skin: "#e0ac84", shade: "#c48f66", hair: "#2b1b12", shirt: "#1d4ed8", mouth: "#8a3b3b", eye: "#3b2a1e",
    front: '<path d="M52 82 Q54 34 100 36 Q146 34 148 82 Q132 56 100 56 Q68 56 52 82Z" fill="#2b1b12"/>',
    extra: '<path d="M60 120 Q100 168 140 120 Q132 150 100 156 Q68 150 60 120Z" fill="#2b1b12" opacity=".35"/>'
  }),
  robot:
    '<svg viewBox="0 0 200 220" class="avatar-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M25 220 Q30 172 100 166 Q170 172 175 220Z" fill="#475569"/>' +
    '<rect x="88" y="150" width="24" height="22" rx="6" fill="#94a3b8"/>' +
    '<line x1="100" y1="18" x2="100" y2="40" stroke="#94a3b8" stroke-width="4"/><circle cx="100" cy="14" r="7" fill="#22d3ee"/>' +
    '<rect x="22" y="80" width="14" height="40" rx="6" fill="#94a3b8"/><rect x="164" y="80" width="14" height="40" rx="6" fill="#94a3b8"/>' +
    '<rect x="35" y="40" width="130" height="115" rx="30" fill="#cbd5e1"/>' +
    '<rect x="48" y="62" width="104" height="48" rx="18" fill="#0f172a"/>' +
    '<g class="eyes"><circle cx="78" cy="86" r="11" fill="#22d3ee"/><circle cx="122" cy="86" r="11" fill="#22d3ee"/></g>' +
    '<rect class="mouth" x="72" y="128" width="56" height="7" rx="3.5" fill="#0f172a"/></svg>'
};
function renderAvatar() {
  const av = AVATARS[avatarId];
  $("aiName").textContent = av.name + " (" + av.role + ")";
  $("avatarStage").innerHTML = AVATAR_SVGS[avatarId];
}
function setAvatarSpeaking(on) {
  $("aiBox").classList.toggle("speaking", !!on);
  clearInterval(mouthTimer);
  const mouth = $("avatarStage").querySelector(".mouth");
  if (on && mouth) mouthTimer = setInterval(() => { mouth.style.transform = "scaleY(" + (1 + Math.random() * 3.2).toFixed(2) + ")"; }, 120);
  else if (mouth) mouth.style.transform = "scaleY(1)";
}
$("avatarSelect").value = avatarId;
$("avatarSelect").addEventListener("change", (e) => { avatarId = e.target.value; lsSet("lingua_avatar", avatarId); renderAvatar(); });

/* ---- Interface du cours ---- */
function liveLine(kind, label, text) {
  const p = document.createElement("p"); if (kind) p.className = kind;
  if (label) { const s = document.createElement("strong"); s.textContent = label + " "; p.appendChild(s); }
  p.appendChild(document.createTextNode(text));
  $("liveDialogue").appendChild(p);
  $("liveDialogue").scrollTop = $("liveDialogue").scrollHeight;
}
function setStatus(t) { $("aiStatus").textContent = t; }
function setLiveButtons(state) {
  $("manualListenBtn").disabled = !(live.active && state === "waiting");
  $("repeatBtn").disabled = !(live.active && state !== "busy");
}

/* ---- Démarrage ---- */
async function startLive() {
  if (live.active) return;
  live.active = true; live.busy = false; live.listening = false;
  live.history = []; live.correct = 0; live.total = 0; live.lastQuestion = "";
  sessionErrors = [];
  live.scenario = $("scenarioSelect").value;
  $("scenarioSelect").disabled = true;
  $("liveDialogue").innerHTML = "";
  $("courseSummary").classList.add("hidden");
  $("startLiveBtn").classList.add("hidden"); $("stopLiveBtn").classList.remove("hidden");
  renderAvatar();

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    if (!live.active) { stream.getTracks().forEach((t) => t.stop()); return; }
    mediaStream = stream;
    $("webcam").srcObject = stream;
  } catch (e) { liveLine("sys", "", "Caméra indisponible : le cours continue sans caméra."); }
  if (!live.active) return;

  if (!SR) liveLine("sys", "", "Reconnaissance vocale non supportée : utilise Google Chrome (ou installe l'application Google sur le téléphone), ou écris tes réponses ci-dessous.");
  const sl = scenarioLines();
  if (sl) liveLine("sys", "", "Scénario : " + $("scenarioSelect").selectedOptions[0].textContent + ". Le professeur joue son rôle, réponds-lui naturellement.");
  const q = sl ? sl[0] : pick(VOCAB_DATA[currentLang].live[currentLevel]);
  live.history.push({ role: "assistant", content: JSON.stringify({ next_question: q }) });
  await tutorSay([q]);
  if (live.active) startListening();
}

async function tutorSay(parts) {
  const av = AVATARS[avatarId];
  const lang = VOCAB_DATA[currentLang].speechLang;
  live.lastQuestion = parts[parts.length - 1];
  setLiveButtons("busy"); setStatus("🗣️ " + av.name + " parle…");
  liveLine("", av.name + " :", parts.join(" "));
  for (const part of parts) {
    if (!live.active) return;
    await speak(part, { avatar: true, lang });
  }
  if (live.active) { setStatus("🎤 À toi de répondre"); setLiveButtons("waiting"); }
}

/* ---- Écoute du micro ---- */
function startListening() {
  if (!live.active || live.busy || live.listening) return;
  if (!SR) { setStatus("✍️ Écris ta réponse ci-dessous"); return; }
  live.listening = true; $("userBox").classList.add("listening");
  setStatus("🎤 Je t'écoute…"); setLiveButtons("waiting");
  live.rec = listenOnce(VOCAB_DATA[currentLang].speechLang, {
    onResult: (t) => { live.listening = false; $("userBox").classList.remove("listening"); handleAnswer(t); },
    onError: (c) => { if (c !== "no-speech" && c !== "aborted") liveLine("err", "", srErrorText(c)); },
    onEnd: (got) => {
      const wasListening = live.listening;
      live.listening = false; $("userBox").classList.remove("listening");
      if (!got && wasListening && live.active && !live.busy) setStatus("Je n'ai rien entendu : clique « Répondre maintenant » ou écris ta réponse.");
    }
  });
}
function stopRecognition() {
  try { if (live.rec) live.rec.abort(); } catch (e) { /* ignore */ }
  live.listening = false; $("userBox").classList.remove("listening");
}

/* ---- Évaluation de la réponse ---- */
function parseEval(raw) {
  const m = raw.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const o = JSON.parse(m[0]);
      return { correct: !!o.correct, corrected: o.corrected || "", explanation: o.explanation || "", feedback: o.feedback || "", next_question: o.next_question || "" };
    } catch (e) { /* ignore */ }
  }
  return { correct: true, corrected: "", explanation: "", feedback: raw, next_question: "" };
}

async function evaluateAnswer(text) {
  const lang = currentLang, data = VOCAB_DATA[lang];
  if (aiEnabled()) {
    try {
      const sys = "Tu es " + AVATARS[avatarId].name + ", professeur de " + data.name + " en visio avec un élève francophone de niveau " + LEVELS[currentLevel] + ". Tu poses UNE question à la fois, en " + data.name + ", adaptée au niveau. L'élève répond à l'oral : sa réponse est transcrite automatiquement, donc ignore la ponctuation et les majuscules manquantes. Après chaque réponse, réponds UNIQUEMENT par un objet JSON, sans texte autour : {\"correct\": true ou false, \"corrected\": \"phrase corrigée en " + data.name + ", chaîne vide si la réponse est déjà correcte\", \"explanation\": \"explication courte en français de l'erreur, vide si correct\", \"feedback\": \"une réaction naturelle et encourageante en " + data.name + ", 1 phrase\", \"next_question\": \"prochaine question en " + data.name + "\"}";
      const raw = await callLLM([{ role: "system", content: sys + scenarioRoleText() }].concat(live.history.slice(-10)));
      const ev = parseEval(raw); ev.source = "ai"; ev.raw = raw;
      if (!ev.next_question) ev.next_question = nextLocalQuestion();
      return ev;
    } catch (err) {
      liveLine("err", "", "⚠️ IA indisponible (" + err.message + "). Mode local pour cette réponse.");
    }
  }
  const words = text.trim().split(/\s+/).length;
  const corr = localCorrection(text);
  if (words < 3) return { source: "local", correct: false, corrected: "", explanation: "Réponse trop courte : essaie une phrase complète.", feedback: LOCAL_SHORT[lang], next_question: live.lastQuestion };
  return { source: "local", correct: !corr, corrected: "", explanation: corr.replace("💡 ", ""), feedback: pick(LOCAL_FB[lang]), next_question: nextLocalQuestion() };
}

async function handleAnswer(text) {
  if (!live.active) { liveLine("sys", "", "Démarre d'abord le cours avec le bouton « Démarrer le cours »."); return; }
  if (live.busy || !text.trim()) return;
  live.busy = true; stopRecognition(); setLiveButtons("busy");
  liveLine("", "Toi :", "« " + text + " »");
  setStatus("🧠 Analyse de ta réponse…");
  live.history.push({ role: "user", content: text });

  const ev = await evaluateAnswer(text);
  if (!live.active) return;
  live.history.push({ role: "assistant", content: ev.raw || JSON.stringify({ feedback: ev.feedback, next_question: ev.next_question }) });

  live.total++; if (ev.correct) live.correct++;
  progress.liveTotal++; if (ev.correct) progress.liveCorrect++;
  addPoints(ev.correct ? 10 : 3);

  if (ev.correct) liveLine("ok", "✅ Correct !", "+10 pts");
  else {
    let msg = "";
    if (ev.corrected) msg += "Phrase corrigée : « " + ev.corrected + " » ";
    if (ev.explanation) msg += "— " + ev.explanation;
    liveLine("fix", "✏️ Correction :", (msg || "Essaie encore.") + " (+3 pts)");
    sessionErrors.push({ question: live.lastQuestion, answer: text, corrected: ev.corrected || "", explanation: ev.explanation || "" });
  }
  if (ev.source === "local") liveLine("sys", "", "Correction locale limitée : l'IA est indisponible pour cette réponse.");

  const parts = [];
  if (ev.feedback) parts.push(ev.feedback);
  if (!ev.correct && ev.corrected) parts.push(ev.corrected);
  parts.push(ev.next_question);
  live.busy = false;
  await tutorSay(parts);
  if (live.active) startListening();
}

/* ---- Boutons ---- */
const savedScn = lsGet("lingua_scenario");
if (savedScn && SCENARIOS[savedScn]) $("scenarioSelect").value = savedScn;
$("scenarioSelect").addEventListener("change", (e) => lsSet("lingua_scenario", e.target.value));
$("startLiveBtn").addEventListener("click", startLive);
$("stopLiveBtn").addEventListener("click", () => endLive());
$("manualListenBtn").addEventListener("click", () => { if (!live.busy && !live.listening) startListening(); });
$("repeatBtn").addEventListener("click", async () => {
  if (!live.active || live.busy || !live.lastQuestion) return;
  stopRecognition(); live.busy = true;
  setStatus("🗣️ " + AVATARS[avatarId].name + " répète…");
  await speak(live.lastQuestion, { avatar: true, lang: VOCAB_DATA[currentLang].speechLang });
  live.busy = false;
  if (live.active) { setStatus("🎤 À toi de répondre"); startListening(); }
});
$("liveForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const t = $("liveInput").value.trim(); if (!t) return;
  if (!live.active) { liveLine("sys", "", "Démarre d'abord le cours avec le bouton « Démarrer le cours »."); return; }
  if (live.busy) return;
  $("liveInput").value = ""; handleAnswer(t);
});
$("closeSummaryBtn").addEventListener("click", () => $("courseSummary").classList.add("hidden"));

/* ---- Fin du cours ---- */
function endLive() {
  if (!live.active) return;
  live.active = false; live.busy = false;
  stopRecognition();
  stopSpeaking();
  setAvatarSpeaking(false);
  if (mediaStream) { mediaStream.getTracks().forEach((t) => t.stop()); mediaStream = null; }
  $("webcam").srcObject = null;
  $("startLiveBtn").classList.remove("hidden"); $("stopLiveBtn").classList.add("hidden");
  $("manualListenBtn").disabled = true; $("repeatBtn").disabled = true;
  $("scenarioSelect").disabled = false;
  setStatus("Cours terminé");
  liveLine("sys", "", "Session terminée.");
  saveProgress();
  showCourseSummary();
}

/* ---- Bilan ---- */
async function showCourseSummary() {
  const box = $("courseSummary"), content = $("summaryContent");
  content.innerHTML = "";
  const stats = document.createElement("p");
  const pct = live.total ? Math.round(live.correct / live.total * 100) : 0;
  stats.textContent = live.total
    ? "Réponses : " + live.total + " · justes du premier coup : " + live.correct + " (" + pct + " %)"
    : "Aucune réponse donnée pendant cette session.";
  content.appendChild(stats);

  if (live.total && !sessionErrors.length) {
    const p = document.createElement("p"); p.textContent = "🎉 Aucune erreur détectée. Bravo !";
    content.appendChild(p);
    box.classList.remove("hidden");
    return;
  }
  if (!sessionErrors.length) { box.classList.remove("hidden"); return; }

  const uniq = [], seen = new Set();
  sessionErrors.forEach((e) => {
    const key = (e.corrected || e.answer).toLowerCase().trim();
    if (!seen.has(key)) { seen.add(key); uniq.push(e); }
  });

  const intro = document.createElement("p"); intro.textContent = "Erreurs de cette session :";
  const ul = document.createElement("ul");
  uniq.forEach((e) => {
    const li = document.createElement("li");
    const a = document.createElement("strong"); a.textContent = "Ta réponse : ";
    li.append(a, document.createTextNode("« " + e.answer + " »"), document.createElement("br"));
    const b = document.createElement("strong"); b.textContent = "Correction : ";
    li.append(b, document.createTextNode("« " + (e.corrected || "—") + " »"));
    if (e.explanation) { const em = document.createElement("em"); em.textContent = e.explanation; li.append(document.createElement("br"), em); }
    ul.appendChild(li);
  });
  const sugTitle = document.createElement("p"); sugTitle.textContent = "💡 Exercices suggérés :";
  const sug = document.createElement("ul");
  ["Répète ces phrases dans l'onglet « Répète ».", "Refais les cartes marquées « À revoir ».", "Fais 5 exercices à trous sur ces structures."].forEach((t) => {
    const li = document.createElement("li"); li.textContent = t; sug.appendChild(li);
  });
  content.append(intro, ul, sugTitle, sug);
  box.classList.remove("hidden");

  if (aiEnabled()) {
    try {
      const request = "Voici les erreurs d'un élève en " + VOCAB_DATA[currentLang].name + " : " + uniq.map((e) => '"' + e.answer + '" -> "' + e.corrected + '" (' + e.explanation + ")").join("; ") + ". Propose 3 exercices courts et concrets (phrases à compléter ou à corriger) pour travailler ces points. Réponds en français, sous forme de liste HTML simple (<ul><li>...</li></ul>).";
      const raw = await callLLM([{ role: "user", content: request }]);
      const items = Array.from(raw.matchAll(/<li>([\s\S]*?)<\/li>/gi)).map((m) => m[1].replace(/<[^>]+>/g, "").trim()).filter(Boolean).slice(0, 5);
      if (items.length) {
        sug.innerHTML = "";
        items.forEach((t) => { const li = document.createElement("li"); li.textContent = t; sug.appendChild(li); });
      }
    } catch (e) { /* on garde les suggestions par défaut */ }
  }
}

/* =========================================================
   Progrès
   ========================================================= */
function renderWeekChart() {
  const box = $("weekChart"); box.innerHTML = "";
  const hist = progress.history || {};
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5);
    days.push({ key: dayStr(d), label: d.toLocaleDateString("fr-FR", { weekday: "short" }) });
  }
  const max = Math.max(progress.dailyGoal, ...days.map((d) => hist[d.key] || 0));
  days.forEach((d) => {
    const v = hist[d.key] || 0;
    const col = document.createElement("div"); col.className = "week-col";
    const val = document.createElement("span"); val.className = "week-val"; val.textContent = v || "";
    const bar = document.createElement("div");
    bar.className = "week-bar" + (v >= progress.dailyGoal ? " goal" : "");
    bar.style.height = Math.round(v / max * 100) + "%";
    const day = document.createElement("span"); day.className = "week-day"; day.textContent = d.label.replace(".", "");
    col.append(val, bar, day); box.appendChild(col);
  });
}
function renderProgress() {
  renderWeekChart();
  const stats = $("statsGrid"); stats.innerHTML = "";
  const avg = progress.pronCount ? Math.round(progress.pronSum / progress.pronCount) : 0;
  const livePct = progress.liveTotal ? Math.round(progress.liveCorrect / progress.liveTotal * 100) : 0;
  const rows = [
    { v: progress.points, l: "Points totaux" },
    { v: progress.streak + " j", l: "Série actuelle" },
    { v: avg + " %", l: "Prononciation moyenne" },
    { v: livePct + " %", l: "Réussite face-à-face" }
  ];
  rows.forEach((r) => {
    const s = document.createElement("div"); s.className = "stat";
    s.innerHTML = `<strong>${r.v}</strong><span>${r.l}</span>`;
    stats.appendChild(s);
  });
  const hist = $("historyList"); hist.innerHTML = "";
  const recent = progress.quizHistory.slice(-8).reverse();
  if (!recent.length) hist.innerHTML = '<p class="muted">Aucun quiz encore.</p>';
  recent.forEach((h) => {
    const row = document.createElement("div"); row.className = "list-row";
    row.innerHTML = `<span>${h.date} — ${VOCAB_DATA[h.lang] ? VOCAB_DATA[h.lang].name : h.lang} (${LEVELS[h.level] || h.level})</span><strong>${h.score}/${h.total}</strong>`;
    hist.appendChild(row);
  });
  const mist = $("mistakesList"); mist.innerHTML = "";
  const mk = Object.keys(progress.mistakes).filter((k) => k.startsWith(currentLang + "|" + currentLevel + "|"));
  if (!mk.length) mist.innerHTML = '<p class="muted">Rien à revoir pour l\'instant 🎉</p>';
  mk.forEach((k) => {
    const idx = parseInt(k.split("|")[2], 10);
    const item = curList()[idx]; if (!item) return;
    const row = document.createElement("div"); row.className = "list-row";
    const w = document.createElement("span"); w.textContent = item.word;
    const c = document.createElement("span"); c.className = "muted"; c.textContent = "×" + progress.mistakes[k];
    row.append(w, c);
    mist.appendChild(row);
  });
}
$("resetProgressBtn").addEventListener("click", () => {
  if (!confirm("Effacer toute ta progression ?")) return;
  progress = defaultProgress(); saveProgress();
  srData = {}; saveSR();
  renderScore(); renderDailyGoal(); renderProgress();
});

/* =========================================================
   Démarrage
   ========================================================= */
renderScore();
renderDailyGoal();
renderGrammar();
renderFlashcard();
resetQuizState();
renderQuiz();
renderPron();
initTutor();
renderAvatar();
renderProgress();
renderExercise();

/* ---- PWA : service worker ---- */
if ("serviceWorker" in navigator && !IS_NATIVE) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("/sw.js").catch(() => {}); });
}