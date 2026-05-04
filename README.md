# NutriTrack — Your Daily Health Dashboard

A comprehensive, organic-modern health tracker built with Vanilla JavaScript, HTML5, and CSS3. NutriTrack allows users to monitor their nutrition, hydration, and long-term health trends through an interactive, data-driven interface.


##  Features
- **Holistic Nutrition Tracking:** Log food from an integrated database or enter custom values for calories, macros, and 6 essential micronutrients.
- **Dynamic Hydration Bottle:** A visual water tracker featuring a wave-animated bottle that fills in real-time as you log glasses[cite: 6, 7].
- **7-Day History Chart:** Visualizes caloric intake trends over the past week using a custom-built bar chart system[cite: 5, 6].
- **Personalized Goal Setting:** Adjust daily targets for calories, macros, and water to tailor the dashboard to your fitness level[cite: 5, 6].
- **Interactive Macro Breakdown:** Real-time segmented bar that displays the percentage distribution of Protein, Carbs, and Fats[cite: 6, 7].
- **Smart Health Tips:** Context-aware suggestions that rotate based on your logging activity to encourage better habits[cite: 5, 6].

##  Technical Stack
- **HTML5:** Semantic architecture including tabbed panel navigation for a single-page feel.
- **CSS3:** Custom "Dark Earth" design system utilizing CSS variables, Flexbox, Grid, and complex SVG stroke-dasharray animations[cite: 7].
- **JavaScript (ES6+):** Robust state management, `localStorage` persistence, and automated daily archiving logic.

##  Project Structure
```text
├── index.html   # Application layout, SVGs, and tab panels
├── style.css    # Organic-Modern design system and animations
└── app.js       # Core logic, food database, and state management

##  How to Use
Dashboard: View your real-time progress toward your calorie, macro, and water goals.  

Log Food: Search the FOOD_DB or use the "Custom Entry" form to add meals to your daily log[cite: 5, 6].

Hydrate: Use the quick-add glass buttons to fill your virtual water bottle[cite: 6].

Review: Visit the History tab to see your performance trends over the last 7 days[cite: 5].

##  Future Roadmap
[1] Barcode Scanning: Integration with a nutrition API for real-world product logging.

[2] Weight Tracking: A new module to track and graph body weight over time.

[3] Data Export: Capability to export your 7-day history as a PDF or CSV file.

##  License
MIT

Created with  NutriTrack (HTML, CSS, and JS)
