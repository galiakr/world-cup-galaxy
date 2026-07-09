export type TranslationKey = keyof typeof TRANSLATIONS.en;

export const TRANSLATIONS = {
  en: {
    // App
    app_name: '⚽ World Cup 2026 ⚽',
    tagline: 'USA · Canada · Mexico',
    home_eyebrow: 'MISSION CONTROL',

    // Nav
    nav_home: 'Home',
    nav_matches: 'Matches',
    nav_teams: 'Teams',
    nav_quiz: 'Quiz',
    nav_stickers: 'Stickers',
    nav_predict: 'Predict',
    nav_rules: 'Rules',
    nav_report: 'Report',

    // Login
    login_title: 'World Cup Kids!',
    login_subtitle: 'Pick your avatar and enter your name',
    login_name_placeholder: 'Your name...',
    login_btn: "Let's Play! 🚀",
    login_hint: 'No password needed — just pick an avatar!',
    login_name_required: 'Please enter your name!',
    login_name_taken:
      'That name is taken — if it\'s yours, use "Recover with a code" below!',
    login_recover_link: 'Already have a recovery code?',
    login_recover_code_placeholder: 'Your code (e.g. ABCD-2345)',
    login_recover_btn: 'Recover my profile',
    login_recover_back: '← Back to sign up',
    login_recover_invalid: "That name or code doesn't match. Try again!",
    generic_error: 'Something went wrong. Try again!',
    login_code_title: 'Save your recovery code!',
    login_code_subtitle:
      "You'll need this to play on another device — write it down somewhere safe!",
    login_code_continue: "I saved it — Let's play! 🚀",
    login_parent_info_toggle: 'ℹ️ For parents',
    login_parent_info_text:
      "No passwords or emails — just a name and avatar. Up to 4 kids can share this device and switch anytime. After signup you'll see a one-time recovery code — save it; it's the only way to add this player on a different device.",

    // Home
    home_teams: 'Teams',
    home_matches: 'Matches',
    home_days_left: 'Days Left',
    home_daily_sticker: 'Daily Sticker',
    home_daily_sub: "Tap to collect today's sticker",
    home_daily_claimed: 'Come back tomorrow for another sticker!',
    home_top_scorers: 'Top Scorers',
    home_goals: 'goals',
    home_yesterday: "Yesterday's Results",
    home_today: "Today's Matches",
    home_tomorrow: "Tomorrow's Matches",
    home_no_matches: 'No matches today',
    matches_load_error: "Couldn't load matches. Please try again.",
    matches_stale_notice:
      "Showing saved results. live updates aren't available right now.",
    matches_stale_time: 'Last updated',
    update_attempt_label: 'Last update attempt',
    credit_by: 'by',
    home_streak: 'day streak',
    switcher_open: 'Switch Player',
    switcher_title: 'Players on this device',
    switcher_active: 'Playing',
    switcher_add_title: 'Add a player',
    switcher_add_confirm: 'Create player',
    switcher_add_error:
      "Couldn't add that player. The name might be taken — try a different one!",
    switcher_limit_reached:
      'This device already has 4 players — remove one before adding another.',

    // Matches page
    matches_title: 'Match History',
    matches_upcoming: 'Upcoming',
    matches_results: 'Results',
    matches_bracket_tab: 'Bracket',
    matches_map_toggle: 'Stadium Map',
    match_group: 'Group',
    match_finished: 'Finished',
    match_referee: 'Referee',
    match_referee_unknown: 'No information',
    referee_matches_judged: 'matches judged so far',
    match_weather_forecast: 'at kickoff',
    match_weather_now: 'right now',
    match_summary: 'Match Summary',
    match_scheduled: 'Upcoming',
    match_live: 'IN PROGRESS',
    match_pens: 'Pens.',

    // Teams
    teams_title: 'All Teams',
    teams_map_toggle: 'Country Map',
    teams_search: 'Search teams...',
    teams_coach: 'Coach',
    teams_group: 'Group',
    teams_squad: 'Squad',
    teams_no_photo: 'No photo available',
    teams_loading: 'Loading...',
    teams_back: 'Back to teams',
    stage_group: '⚽ Group Stage',
    stage_round_of_32: 'Round of 32',
    stage_round_of_16: 'Round of 16',
    stage_quarter: 'Quarterfinals',
    stage_semi: 'Semifinals',
    stage_third_place: 'Third Place Match',
    stage_final: 'Final',
    bracket_title: 'Knockout Bracket',
    bracket_tbd: 'TBD',
    bracket_expand_all: 'Expand all',
    bracket_collapse: 'Collapse',
    stage_champion: '🏆 Champion',
    stage_runner_up: '🥈 Runner-up',
    stage_fourth_place: '4th Place',
    stage_eliminated: 'Eliminated',
    teams_points_label: 'Points',
    teams_played_label: 'Played',
    standings_played: 'Played',
    standings_gd: 'Goal difference',
    standings_points: 'Points',
    pos_goalkeeper: 'Goalkeeper',
    pos_defender: 'Defender',
    pos_midfielder: 'Midfielder',
    pos_forward: 'Forward',

    // Quiz
    quiz_title: 'Daily Quiz',
    quiz_subtitle: 'Answer correctly to earn stickers!',
    quiz_correct: 'Correct! 🎉',
    quiz_wrong: 'Not quite! The answer was:',
    quiz_next: 'Next Question →',
    quiz_earn: 'Answer correctly and earn a sticker!',
    quiz_done_today: 'Great job! Come back tomorrow for more questions!',
    quiz_score: 'Score',
    quiz_finish: '🏆 Finish!',
    quiz_difficulty_easy: 'Easy',
    quiz_difficulty_medium: 'Medium',
    quiz_difficulty_hard: 'Hard',

    // Stickers
    stickers_title: 'My Sticker Album',
    stickers_count: 'stickers',
    stickers_progress: 'stickers to next level!',
    stickers_locked: 'Locked',
    stickers_categories: 'All',
    stickers_country: 'Countries',
    stickers_player: 'Players',
    stickers_moment: 'Moments',
    stickers_achievement: 'Achievements',
    stickers_new_badge: 'NEW!',
    rarity_common: '🤍 COMMON',
    rarity_rare: '💙 RARE',
    rarity_epic: '💜 EPIC',
    rarity_legend: '⭐ LEGEND',
    stickers_guide_title: 'How rarity works',
    stickers_guide_text:
      'The rarer the color, the harder a sticker is to find!',
    rarity_common_desc: 'Easy to find — daily logins and easy quiz questions',
    rarity_rare_desc:
      'A bit trickier — correct predictions and medium questions',
    rarity_epic_desc: 'Hard to find — streaks and hard quiz questions',
    rarity_legend_desc: 'Super rare — big achievements and perfect scores',

    // Predictions
    predict_title: 'Predict the Score',
    predict_subtitle: 'Guess the final score of upcoming matches!',
    predict_submit: 'Submit Prediction! 🔮',
    predict_submitted: 'Prediction saved!',
    predict_submit_error: "Couldn't save your prediction — please try again.",
    predict_exact: 'Exact score — sticker earned! 💎',
    predict_winner: 'Correct winner! 🎯',
    predict_my: 'My Predictions',
    predict_guessed: 'Predicted:',
    predict_result: 'Result:',
    predict_no_upcoming: 'No upcoming matches to predict right now',
    predict_locked: 'Locked — match has started',
    predict_live: '🔴 In progress — prediction is locked',
    predict_edit: 'Change prediction',
    predict_vs: 'VS',
    predict_loading: '...',
    predict_pens_label: 'If it goes to penalties:',

    // Rules
    rules_title: 'The 17 Laws of Soccer',
    rules_subtitle: 'Based on the official FIFA Laws of the Game',
    rules_law_label: 'Law',
    rule1_title: 'The Field of Play',
    rule1_text:
      'A soccer field must be rectangular, covered in grass (or artificial turf), and marked with white lines. The two short ends have goals. The centre circle, penalty areas, and corner arcs all have specific sizes set by FIFA.',
    rule2_title: 'The Ball',
    rule2_text:
      'The ball must be round, made of leather or similar material, size 5 for adults, and inflated to the right pressure. If it bursts during a match, play stops and a new ball is used — the game restarts where the old ball stopped.',
    rule3_title: 'The Players',
    rule3_text:
      'Each team has 11 players, including one goalkeeper. The minimum to start a match is 7. At the World Cup, each team can name 26 players in their squad and make 5 substitutions during a game (plus a 6th in extra time).',
    rule4_title: "Players' Equipment",
    rule4_text:
      "Every player must wear a jersey, shorts, socks, shin guards, and cleats. The goalkeeper wears different colours from both teams so the referee can tell them apart. No jewellery is allowed — it's a safety rule!",
    rule5_title: 'The Referee',
    rule5_text:
      'The referee is the boss on the pitch. Their decisions are final. They can stop play for injuries, show cards, award free kicks and penalties, and add extra time at the end of each half for stoppages. VAR (video review) can help the referee correct clear mistakes.',
    rule6_title: 'Assistant Referees',
    rule6_text:
      'Two assistant referees (linesmen) run along the sidelines with flags. They signal when the ball goes out of play, which team gets the throw-in or corner, and — most importantly — when a player is offside.',
    rule7_title: 'Duration of the Match',
    rule7_text:
      'A match is 90 minutes: two halves of 45 minutes with a 15-minute break. The referee adds "stoppage time" at the end of each half for goals, injuries, substitutions, and VAR checks. In knockout rounds, a draw leads to 30 minutes of extra time, then a penalty shootout.',
    rule8_title: 'The Start and Restart of Play',
    rule8_text:
      'The match starts with a kickoff from the centre circle. The team that wins the coin toss picks which goal to attack. After a goal, the other team kicks off. The ball must move forward on kickoff — but only one touch is needed before another player can take it.',
    rule9_title: 'Ball In and Out of Play',
    rule9_text:
      "The ball is out of play when it fully crosses the goal line or touchline — even in the air. As long as any part of the ball is on or above the line, it's still in play. Play also stops when the referee blows the whistle.",
    rule10_title: 'Scoring a Goal',
    rule10_text:
      'A goal is scored when the whole ball crosses the goal line between the posts and under the crossbar — as long as no rule was broken. The team with more goals at the end wins. Goal-line technology or VAR can confirm if the ball crossed the line.',
    rule11_title: 'Offside',
    rule11_text:
      "You are offside if you are in the opponent's half and any part of your body you can score with (not arms) is closer to the goal than both the ball AND the second-to-last defender when the ball is played to you. Just being offside isn't a foul — you have to be involved in active play.",
    rule12_title: 'Fouls and Misconduct',
    rule12_text:
      "A foul is called for illegal tackles, pushing, holding, handball (deliberate), or dangerous play. A yellow card is a warning — two yellows = red card. A red card means you're off and your team plays with 10. Serious fouls (violent conduct, denying a clear goal) go straight to red.",
    rule13_title: 'Free Kicks',
    rule13_text:
      "After a foul, the other team gets a free kick. A direct free kick can go straight into the goal. An indirect free kick must touch another player first. The defending wall must be at least 9.15 metres away. The kicker can't touch the ball again until another player has.",
    rule14_title: 'Penalty Kick',
    rule14_text:
      'A penalty is given when a foul that would normally be a free kick happens inside the penalty area. It is taken from the penalty spot, 11 metres from goal. Only the goalkeeper can stand on the line. All other players must stay outside the box until the ball is kicked.',
    rule15_title: 'Throw-In',
    rule15_text:
      "When the ball goes over a touchline (side line), the team that didn't touch it last gets a throw-in. You must use both hands, throw from behind and over your head, keep both feet on or behind the line, and face the pitch. You can't score directly from a throw-in.",
    rule16_title: 'Goal Kick',
    rule16_text:
      "When the attacking team last touches the ball before it crosses the goal line (but not in the goal), the defending team gets a goal kick. It's taken from anywhere inside the 6-yard box. Since 2019, teammates can be inside the penalty area when the kick is taken.",
    rule17_title: 'Corner Kick',
    rule17_text:
      "When the defending team last touches the ball before it crosses their own goal line (but doesn't go in the goal), the attacking team gets a corner kick. It's taken from the corner arc nearest to where the ball went out. You can score directly from a corner kick!",

    // How the World Cup Works
    wc_title: 'How the World Cup Works',
    wc_host_title: 'How Is the Host Country Chosen?',
    wc_host_text:
      'Countries that want to host the World Cup submit a "bid" to FIFA — like applying for the most exciting job in the world! The bid includes plans for stadiums, hotels, transportation, and safety. FIFA inspectors visit each candidate country to check if everything is ready. Then FIFA\'s member countries vote to decide the winner. The host is usually announced 7–10 years before the tournament, so there\'s enough time to prepare.',
    wc_prep_title: 'What Preparations Are Required?',
    wc_prep_intro:
      "Hosting the World Cup is a massive project. Here's what a host country needs to prepare:",
    wc_prep_1:
      "🏟️ Stadiums — Must meet FIFA's standards: enough seats (at least 40,000 for group matches, 80,000+ for the final), safe exits, giant screens, and great pitches. Some are built from scratch; others are renovated.",
    wc_prep_2:
      '🏨 Hotels & Accommodation — Tens of thousands of players, officials, journalists, and fans all need somewhere to sleep. The host must guarantee enough rooms near every stadium.',
    wc_prep_3:
      '✈️ Airports & Transport — FIFA requires fast, reliable transport between host cities. This means upgraded airports, new train lines, and organized bus routes for fans.',
    wc_prep_4:
      '🔒 Safety & Security — A huge police and security operation protects every match. The host government works with FIFA to plan this years in advance.',
    wc_prep_5:
      '📺 Broadcasting — Every stadium needs a world-class TV setup so billions of people can watch the games live from home.',
    wc_prep_6:
      '🌐 Technology — VAR systems, goal-line technology, and stadium Wi-Fi all have to be installed and tested before the first match.',
    wc_structure_title: 'How Does the Tournament Work?',
    wc_structure_intro:
      'The 2026 World Cup has 48 teams, organized in 12 groups of 4 teams each.',
    wc_structure_group:
      'Group Stage — Every team plays 3 matches against the other teams in their group. A win earns 3 points, a draw earns 1 point, and a loss earns 0 points. The top 2 teams from each group advance, plus the 8 best third-place teams — making 32 teams in the knockout rounds.',
    wc_structure_knockout_intro:
      "Knockout Rounds — From here, it's sudden death. Lose once and you're out. The rounds are:",
    wc_round_1: 'Round of 32 (32 teams)',
    wc_round_2: 'Round of 16 (16 teams)',
    wc_round_3: 'Quarter-Finals (8 teams)',
    wc_round_4: 'Semi-Finals (4 teams)',
    wc_round_5: 'Third Place Play-off (the two semi-final losers)',
    wc_round_6: 'THE FINAL 🏆',
    wc_structure_extra_time:
      "If a knockout match is tied after 90 minutes, teams play 30 minutes of extra time. If it's still tied, there's a penalty shootout — each team takes 5 penalties, and the one that scores more wins!",
    wc_qualify_title: 'How Do Teams Qualify?',
    wc_qualify_intro:
      "Only 48 teams out of FIFA's 211 member countries get to play at the World Cup. Each region of the world has its own qualifying competition:",
    wc_qualify_1: '🌍 Africa (CAF) — 9 spots',
    wc_qualify_2: '🌎 South America (CONMEBOL) — 6 spots + 1 play-off',
    wc_qualify_3: '🌏 Asia (AFC) — 8 spots + 1 play-off',
    wc_qualify_4: '🌍 Europe (UEFA) — 16 spots',
    wc_qualify_5:
      '🌎 North & Central America (CONCACAF) — 6 spots + 1 play-off (includes the 3 hosts automatically)',
    wc_qualify_6: '🌊 Oceania (OFC) — 1 play-off spot',
    wc_qualify_outro:
      'The 3 host nations (USA, Canada, Mexico) qualify automatically — no need to play qualifiers!',
    wc_facts_title: 'Cool World Cup 2026 Facts',
    wc_fact_1: '🗺️ First ever World Cup hosted by 3 countries',
    wc_fact_2: '🏟️ 16 stadiums across 3 countries',
    wc_fact_3: '👥 48 teams — up from 32 in previous tournaments',
    wc_fact_4: '⚽ 104 matches total — up from 64',
    wc_fact_5: '🏆 Final at MetLife Stadium, New Jersey (capacity 82,500)',
    wc_fact_6: '📅 Tournament runs June 11 – July 19, 2026',

    // Bug report
    bug_title: 'Report a Problem',
    bug_type_wrong: 'Wrong info',
    bug_type_tech: 'Technical bug',
    bug_type_missing: 'Missing info',
    bug_type_other: 'Other',
    bug_placeholder: 'Describe the problem...',
    bug_submit: 'Send Report 📨',
    bug_thanks: '📨 Report sent — thank you!',
    bug_empty: 'Please write something!',

    // Toast
    toast_new_sticker: 'New sticker!',

    // Dates
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
  },
  he: {
    app_name: '⚽ גביע העולם 2026 ⚽',
    tagline: 'ארה"ב · קנדה · מקסיקו',
    home_eyebrow: 'מרכז בקרה',

    nav_home: 'בית',
    nav_matches: 'משחקים',
    nav_teams: 'קבוצות',
    nav_quiz: 'חידון',
    nav_stickers: 'מדבקות',
    nav_predict: 'נחשו תוצאות',
    nav_rules: 'חוקים',
    nav_report: 'דיווח',

    login_title: '⚽ גביע העולם!',
    login_subtitle: 'בחרו אווטאר ושם',
    login_name_placeholder: 'השם שלך...',
    login_btn: 'בואו נשחק! 🚀',
    login_hint: 'אין צורך בסיסמה — רק לבחור אווטאר!',
    login_name_required: 'הכניסו שם',
    login_name_taken: 'השם הזה תפוס — אם זה שלך, השתמש/י ב"שחזור עם קוד" למטה!',
    login_recover_link: 'יש לך קוד שחזור?',
    login_recover_code_placeholder: 'הקוד שלך (למשל ABCD-2345)',
    login_recover_btn: 'שחזר את הפרופיל שלי',
    login_recover_back: '← חזרה להרשמה',
    login_recover_invalid: 'השם או הקוד לא תואמים. נסו שוב!',
    generic_error: 'משהו השתבש. נסו שוב!',
    login_code_title: 'שמרו את קוד השחזור !',
    login_code_subtitle:
      'תצטרכו אותו כדי לשחק במכשיר אחר — כתבו אותו במקום בטוח!',
    login_code_continue: 'שמרתי אותו — בואו נשחק! 🚀',
    login_parent_info_toggle: 'ℹ️ להורים',
    login_parent_info_text:
      'אין צורך בסיסמאות או אימיילים. רק שם ואווטאר. עד 4 השחקנים/יות במכשיר אחד. אחרי ההרשמה יוצג קוד שחזור חד-פעמי, שמרו אותו. זו הדרך היחידה להוסיף את השחקנים/יות למכשיר אחר.',

    home_teams: 'קבוצות',
    home_matches: 'משחקים',
    home_days_left: 'ימים לסיום',
    home_daily_sticker: 'מדבקה יומית',
    home_daily_sub: 'לחצו כדי לאסוף את המדבקה של היום',
    home_daily_claimed: 'חזרו מחר למדבקה נוספת!',
    home_top_scorers: 'מלכי השערים',
    home_goals: 'שערים',
    home_yesterday: 'תוצאות אתמול',
    home_today: 'משחקי היום',
    home_tomorrow: 'משחקי מחר',
    home_no_matches: 'אין משחקים היום',
    matches_load_error: 'טעינת המשחקים נכשלה. נסו שוב.',
    matches_stale_notice:
      'מוצגות תוצאות שמורות .עדכונים חיים אינם זמינים כרגע.',
    matches_stale_time: 'עודכן לאחרונה',
    update_attempt_label: 'ניסיון עדכון אחרון',
    credit_by: 'מאת',
    home_streak: 'ימים רצופים',
    switcher_open: 'החליפו שחקנים/יות',
    switcher_title: 'שחקנים/יות במכשיר הזה',
    switcher_active: 'משחק',
    switcher_add_title: 'הוסיפו שחקנ/ית',
    switcher_add_confirm: 'צרו שחקנ/ית',
    switcher_add_error:
      'לא הצלחנו להוסיף את השחקנ/ית. אולי השם תפוס — נסו שם אחר!',
    switcher_limit_reached: 'במכשיר הזה יש כבר 4 שחקנים/יות.',

    matches_title: 'היסטוריית משחקים',
    matches_upcoming: 'הבאים',
    matches_results: 'תוצאות',
    matches_bracket_tab: 'נוקאאוט',
    matches_map_toggle: 'מפת האצטדיונים',
    match_group: 'קבוצה',
    match_finished: 'הסתיים',
    match_referee: 'שופט',
    match_referee_unknown: 'אין מידע',
    referee_matches_judged: 'משחקים ששפט עד כה',
    match_weather_forecast: 'בזמן המשחק',
    match_weather_now: 'ממש עכשיו',
    match_summary: 'סיכום המשחק',
    match_scheduled: 'קרוב',
    match_live: 'מתקיים עכשיו',
    match_pens: 'פנדלים',

    teams_title: 'כל הקבוצות',
    teams_map_toggle: 'מפת המדינות',
    teams_search: 'חפשו קבוצה...',
    teams_coach: 'מאמן',
    teams_group: 'קבוצת בתים',
    teams_squad: 'הרכב',
    teams_no_photo: 'אין תמונה זמינה',
    teams_loading: 'טוען...',
    teams_back: 'חזרה לקבוצות',
    stage_group: '⚽ שלב הבתים',
    stage_round_of_32: 'שלב ה-32',
    stage_round_of_16: 'שמינית הגמר',
    stage_quarter: 'רבע גמר',
    stage_semi: 'חצי גמר',
    stage_third_place: 'משחק על מקום שלישי',
    stage_final: 'גמר',
    bracket_title: 'שלבי הנוקאאוט',
    bracket_tbd: 'לא נקבע',
    bracket_expand_all: 'להציג הכל',
    bracket_collapse: 'לכווץ',
    stage_champion: '🏆 אלופה',
    stage_runner_up: '🥈 מקום שני',
    stage_fourth_place: 'מקום רביעי',
    stage_eliminated: 'הודחה',
    teams_points_label: 'נקודות',
    teams_played_label: 'משחקים',
    standings_played: 'משחקים',
    standings_gd: 'הפרש שערים',
    standings_points: 'נקודות',
    pos_goalkeeper: 'שוער',
    pos_defender: 'בלם',
    pos_midfielder: 'קשר',
    pos_forward: 'חלוץ',

    quiz_title: 'חידון יומי',
    quiz_subtitle: 'ענו נכון וקבלו מדבקות!',
    quiz_correct: 'נכון! 🎉',
    quiz_wrong: 'לא בדיוק! התשובה הנכונה היא:',
    quiz_next: 'שאלה הבאה ←',
    quiz_earn: 'ענו נכון וקבלו מדבקה!',
    quiz_done_today: 'כל הכבוד! חזרו מחר לשאלות נוספות!',
    quiz_score: 'ניקוד',
    quiz_finish: '🏆 סיום!',
    quiz_difficulty_easy: 'קל',
    quiz_difficulty_medium: 'בינוני',
    quiz_difficulty_hard: 'קשה',

    stickers_title: 'אלבום המדבקות שלי',
    stickers_count: 'מדבקות',
    stickers_progress: 'מדבקות לרמה הבאה!',
    stickers_locked: 'נעול',
    stickers_categories: 'הכל',
    stickers_country: 'מדינות',
    stickers_player: 'שחקנים',
    stickers_moment: 'רגעים',
    stickers_achievement: 'הישגים',
    stickers_new_badge: 'חדש!',
    rarity_common: '🤍 נפוץ',
    rarity_rare: '💙 נדיר',
    rarity_epic: '💜 אפי',
    rarity_legend: '⭐ אגדי',
    stickers_guide_title: 'איך דירוג המדבקות מתבצע',
    stickers_guide_text: 'ככל שהמדבקה נדירה יותר, קשה יותר למצוא אותה!',
    rarity_common_desc: 'קל למצוא: כניסה יומית ושאלות חידון קלות',
    rarity_rare_desc: 'קצת יותר מאתגר: ניחושים נכונים ושאלות בקושי בינוני',
    rarity_epic_desc: 'קשה למצוא: רצף ימים וצעדים מיוחדים במשחק',
    rarity_legend_desc: 'נדיר מאוד: הישגים גדולים וניחושים מדויקים',

    predict_title: 'נחשו את התוצאה',
    predict_subtitle: 'נחשו את התוצאה הסופית של משחקים קרובים!',
    predict_submit: 'שלחו ניחוש! 🔮',
    predict_submitted: 'הניחוש נשמר!',
    predict_submit_error: 'שמירת הניחוש נכשלה — נסו שוב.',
    predict_exact: 'תוצאה מדויקת. מדבקה התקבלה! 💎',
    predict_winner: 'ניחשת נכון מי תנצח! 🎯',
    predict_my: 'הניחושים שלי',
    predict_guessed: 'ניחשתי:',
    predict_result: 'תוצאה:',
    predict_no_upcoming: 'אין משחקים קרובים לנחש כרגע',
    predict_locked: 'נעול. המשחק התחיל',
    predict_live: '🔴 המשחק מתקיים עכשיו. הניחוש נעול',
    predict_edit: 'שנו ניחוש',
    predict_vs: 'נגד',
    predict_loading: '...',
    predict_pens_label: 'אם יגיע לפנדלים:',

    rules_title: 'חוקי הכדורגל',
    rules_subtitle: 'מבוסס על חוקי המשחק הרשמיים של פיפ"א',
    rules_law_label: 'חוק',
    rule1_title: 'מגרש המשחק',
    rule1_text:
      'מגרש כדורגל חייב להיות מלבני, מכוסה דשא (או דשא מלאכותי), ומסומן בקווים לבנים. בשני הקצוות הקצרים יש שערים. עיגול המרכז, שטחי העונשין, ופינות השדה. לכולם מידות מדויקות שקובעת פיפ"א.',
    rule2_title: 'הכדור',
    rule2_text:
      'הכדור חייב להיות עגול, עשוי עור או חומר דומה, מידה 5 למבוגרים, ומנופח בלחץ הנכון. אם הכדור מתפוצץ במהלך משחק, המשחק נעצר ומכניסים כדור חדש .המשחק מתחדש מהמקום בו הכדור הישן התפוצץ.',
    rule3_title: 'השחקנים',
    rule3_text:
      'לכל קבוצה 11 שחקנים, כולל שוער אחד. המינימום להתחיל משחק הוא 7. במונדיאל, כל קבוצה יכולה לרשום 26 שחקנים ולבצע 5 החלפות במהלך המשחק (ועוד 1 בהארכה).',
    rule4_title: 'ציוד השחקנים',
    rule4_text:
      'כל שחקן חייב ללבוש חולצה, מכנסיים קצרים, גרביים, מגיני שוקיים וסוליות. השוער לובש צבעים שונים משתי הקבוצות כדי שהשופט יוכל להבדיל. אסור לענוד תכשיטים, זהו כלל בטיחות!',
    rule5_title: 'השופט',
    rule5_text:
      'השופט הוא הבוס במגרש. החלטותיו סופיות. הוא יכול לעצור את המשחק לפציעות, להראות כרטיסים, לפסוק בעיטות חופשיות ופנדלים, ולהוסיף זמן נוסף בסוף כל מחצית. VAR (ביקורת וידאו) יכול לעזור לשופט לתקן טעויות ברורות.',
    rule6_title: 'עוזרי השופט',
    rule6_text:
      'שני עוזרי שופט (שוליים) רצים לאורך קווי הצד עם דגלים. הם מאותתים כאשר הכדור יוצא מהמגרש, לאיזו קבוצה יש הגשה צדית או קרן, ו - הכי חשוב - מתי שחקן נמצא בעמדת נבדל (אופסייד).',
    rule7_title: 'משך המשחק',
    rule7_text:
      'משחק נמשך 90 דקות: שתי מחציות של 45 דקות עם הפסקה של 15 דקות. השופט מוסיף "זמן פציעות" בסוף כל מחצית על שערים, פציעות, החלפות ובדיקות VAR. בשלב הנוקאאוט, תיקו מוביל ל-30 דקות הארכה ואז לפנדלים.',
    rule8_title: 'פתיחה והפעלה מחדש של המשחק',
    rule8_text:
      'המשחק מתחיל בבעיטת פתיחה ממרכז המגרש. הקבוצה שזוכה בהגרלה בוחרת לאיזה שער לתקוף. לאחר שער, הקבוצה השנייה מבצעת בעיטת פתיחה. הכדור חייב לזוז קדימה בבעיטת הפתיחה, אבל מספיק נגיעה אחת לפני שאחר יכול לקחת אותו.',
    rule9_title: 'כדור במשחק ומחוץ למשחק',
    rule9_text:
      'הכדור מחוץ למשחק כאשר הוא חוצה לחלוטין את קו השער או קו הצד, גם באוויר. כל עוד חלק כלשהו מהכדור נמצא על הקו או מעליו, הוא עדיין במשחק.',
    rule10_title: 'כיצד נרשם שער',
    rule10_text:
      'שער נרשם כאשר הכדור כולו חוצה את קו השער בין העמודים ומתחת לרוחב, כל עוד לא הופרה כל חוקה. הקבוצה עם יותר שערים בסוף מנצחת. טכנולוגיית קו שער או VAR יכולים לאשר אם הכדור חצה את הקו.',
    rule11_title: 'עמדת נבדל (אופסייד)',
    rule11_text:
      'אתה באופסייד אם אתה בחצי המגרש של היריב וחלק כלשהו מגופך שאפשר לכבוש איתו שער (לא ידיים) קרוב יותר לשער מאשר הכדור וגם מהמגן האחרון-לפני-אחרון, ברגע שהכדור מוסר אליך. סתם להיות באופסייד זו לא עבירה ,אתה צריך להיות מעורב בשחק פעיל.',
    rule12_title: 'עבירות והתנהגות לא ראויה',
    rule12_text:
      'עבירה נפסקת על בלימות בלתי חוקיות, דחיפה, אחיזה, מגע יד (מכוון) או שחק מסוכן. כרטיס צהוב הוא אזהרה. שני צהובים = אדום. כרטיס אדום אומר שאתה יוצא והקבוצה שלך משחקת עם 10. עבירות חמורות (התנהגות אלימה, מניעת שער ברור) מקבלות ישירות אדום.',
    rule13_title: 'בעיטות חופשיות',
    rule13_text:
      'לאחר עבירה, הקבוצה השנייה מקבלת בעיטה חופשית. בעיטה חופשית ישירה יכולה להכנס ישירות לשער. בעיטה חופשית עקיפה חייבת לגעת בשחקן נוסף קודם. "החומה" של ההגנה חייבת להיות לפחות 9.15 מטר. הבועט לא יכול לגעת בכדור שוב עד שאחר נגע בו.',
    rule14_title: 'בעיטת עונשין (פנדל)',
    rule14_text:
      'פנדל ניתן כאשר עבירה שהייתה בדרך כלל בעיטה חופשית מתרחשת בתוך שטח העונשין. הוא מבוצע מנקודת הפנדל, 11 מטר מהשער. רק השוער יכול לעמוד על הקו. כל שאר השחקנים חייבים להישאר מחוץ לשטח עד שהכדור נבעט.',
    rule15_title: 'הגשה צדית',
    rule15_text:
      'כאשר הכדור חוצה את קו הצד, הקבוצה שלא נגעה בו אחרונה מקבלת הגשה צדית. חייבים להשתמש בשתי ידיים, להגיש מאחורי הראש ומעליו, לשמור על שתי רגליים על הקו או מאחוריו, ופנים למגרש. לא ניתן לכבוש שער ישירות מהגשה צדית.',
    rule16_title: 'בעיטת שער',
    rule16_text:
      'כאשר הקבוצה התוקפת נוגעת אחרונה בכדור לפני שהוא חוצה את קו השער (אך לא לתוך השער), הקבוצה המגינה מקבלת בעיטת שער. היא מבוצעת מכל מקום בתוך שטח השער. מאז 2019, חברי קבוצה יכולים להיות בתוך שטח העונשין כשהבעיטה מתבצעת.',
    rule17_title: 'בעיטת פינה (קרן)',
    rule17_text:
      'כאשר הקבוצה המגינה נוגעת אחרונה בכדור לפני שהוא חוצה את קו השער שלה (אך לא נכנס לשער), הקבוצה התוקפת מקבלת בעיטת פינה. היא מבוצעת מרחבע הפינה הקרוב למקום שהכדור יצא. ניתן לכבוש שער ישירות מבעיטת פינה!',

    // How the World Cup Works
    wc_title: 'איך המונדיאל עובד',
    wc_host_title: 'איך בוחרים מארח?',
    wc_host_text:
      'מדינות שרוצות לארח את המונדיאל מגישות "מועמדות" לפיפ"א — כמו הגשת מועמדות לתפקיד הכי מרגש בעולם! המועמדות כוללת תוכניות לאצטדיונים, מלונות, תחבורה ובטיחות. פקחי פיפ"א מבקרים בכל מדינה מועמדת כדי לבדוק שהכול מוכן. לאחר מכן חברות פיפ"א מצביעות כדי לקבוע את הזוכה. המארח מוכרז בדרך כלל 7–10 שנים לפני הטורניר, כדי שיהיה מספיק זמן להתכונן.',
    wc_prep_title: 'אילו הכנות נדרשות?',
    wc_prep_intro:
      'אירוח המונדיאל הוא פרויקט ענק. הנה מה שמדינה מארחת צריכה להכין:',
    wc_prep_1:
      '🏟️ אצטדיונים — חייבים לעמוד בדרישות פיפ"א: מספיק מושבים (לפחות 40,000 למשחקי בתים, 80,000+ לגמר), יציאות בטוחות, מסכי ענק ומגרשים מעולים. חלקם נבנים מאפס; אחרים עוברים שיפוץ.',
    wc_prep_2:
      '🏨 מלונות ולינה — עשרות אלפי שחקנים, פקידים, עיתונאים ואוהדים זקוקים למקום לישון. המארח חייב להבטיח מספיק חדרים ליד כל אצטדיון.',
    wc_prep_3:
      '✈️ שדות תעופה ותחבורה — פיפ"א דורשת תחבורה מהירה ואמינה בין ערי המארח. זה אומר שדות תעופה משודרגים, קווי רכבת חדשים ומסלולי אוטובוס מאורגנים לאוהדים.',
    wc_prep_4:
      '🔒 בטיחות ואבטחה — מבצע משטרה ואבטחה ענק מגן על כל משחק. ממשלת המארח עובדת עם פיפ"א כדי לתכנן זאת שנים מראש.',
    wc_prep_5:
      '📺 שידורים — כל אצטדיון זקוק לתשתית טלוויזיה ברמה עולמית כדי שמיליארדי אנשים יוכלו לצפות במשחקים בשידור חי מהבית.',
    wc_prep_6:
      '🌐 טכנולוגיה — מערכות VAR, טכנולוגיית קו שער ו-Wi-Fi באצטדיון — כולם חייבים להיות מותקנים ונבדקים לפני המשחק הראשון.',
    wc_structure_title: 'איך הטורניר מתנהל?',
    wc_structure_intro:
      'במונדיאל 2026 יש 48 קבוצות, מאורגנות ב-12 קבוצות בתים של 4 קבוצות כל אחת.',
    wc_structure_group:
      'שלב הבתים — כל קבוצה משחקת 3 משחקים נגד הקבוצות האחרות בבית שלה. ניצחון מעניק 3 נקודות, תיקו מעניק נקודה 1, והפסד לא מעניק 0 נקודות. 2 הקבוצות המובילות מכל בית עוברות, בנוסף ל-8 הקבוצות הטובות ביותר שסיימו במקום השלישי — מה שמביא 32 קבוצות לשלב הנוקאאוט.',
    wc_structure_knockout_intro:
      'שלב הנוקאאוט — מכאן זה מוות פתאומי. תפסיד פעם אחת ואתה בחוץ. השלבים הם:',
    wc_round_1: 'שלב 32 (32 קבוצות)',
    wc_round_2: 'שלב 16 (16 קבוצות)',
    wc_round_3: 'רבע גמר (8 קבוצות)',
    wc_round_4: 'חצי גמר (4 קבוצות)',
    wc_round_5: 'משחק גמר שלישי (שני המפסידים בחצי גמר)',
    wc_round_6: 'הגמר 🏆',
    wc_structure_extra_time:
      'אם משחק נוקאאוט מסתיים בתיקו לאחר 90 דקות, הקבוצות משחקות 30 דקות הארכה. אם עדיין תיקו, יש בעיטות עונשין — כל קבוצה בועטת 5 פנדלים, והמכניסה יותר מנצחת!',
    wc_qualify_title: 'איך קבוצות מתאימות?',
    wc_qualify_intro:
      'רק 48 קבוצות מתוך 211 המדינות החברות בפיפ"א משחקות במונדיאל. לכל אזור בעולם יש תחרות כשירות משלה:',
    wc_qualify_1: '🌍 אפריקה (CAF) — 9 מקומות',
    wc_qualify_2: '🌎 אמריקה הדרומית (CONMEBOL) — 6 מקומות + פלייאוף 1',
    wc_qualify_3: '🌏 אסיה (AFC) — 8 מקומות + פלייאוף 1',
    wc_qualify_4: '🌍 אירופה (UEFA) — 16 מקומות',
    wc_qualify_5:
      '🌎 צפון ומרכז אמריקה (CONCACAF) — 6 מקומות + פלייאוף 1 (כולל 3 מארחות אוטומטית)',
    wc_qualify_6: '🌊 אוקיאניה (OFC) — מקום פלייאוף 1',
    wc_qualify_outro:
      '3 המדינות המארחות (ארה"ב, קנדה, מקסיקו) מתאימות אוטומטית — אין צורך לשחק כשירות!',
    wc_facts_title: 'עובדות מגניבות על מונדיאל 2026',
    wc_fact_1: '🗺️ המונדיאל הראשון שמארחות אותו 3 מדינות',
    wc_fact_2: '🏟️ 16 אצטדיונים ב-3 מדינות',
    wc_fact_3: '👥 48 קבוצות, לעומת 32 בטורנירים קודמים',
    wc_fact_4: '⚽ 104 משחקים סך הכל, לעומת 64',
    wc_fact_5: "🏆 גמר באצטדיון MetLife, ניו ג'רזי (קיבולת 82,500)",
    wc_fact_6: '📅 הטורניר מתקיים 11 ביוני – 19 ביולי 2026',

    bug_title: 'דווחו על בעיה',
    bug_type_wrong: 'מידע שגוי',
    bug_type_tech: 'בעיה טכנית',
    bug_type_missing: 'חסר משהו',
    bug_type_other: 'אחר',
    bug_placeholder: 'תארו את הבעיה...',
    bug_submit: 'שלחו דיווח',
    bug_thanks: 'הדיווח נשלח. תודה!',
    bug_empty: 'אנא כתבו משהו!',

    toast_new_sticker: 'מדבקה חדשה!',

    today: 'היום',
    yesterday: 'אתמול',
    tomorrow: 'מחר',
  },
};

export function t(lang: 'he' | 'en', key: TranslationKey): string {
  return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
}
