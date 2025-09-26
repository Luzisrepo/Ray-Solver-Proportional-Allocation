# Ray Solver ⚖️

**Ray Solver** is a modern, responsive web app for proportional allocation.  
It lets you input votes (or any resource distribution data), then calculates allocations using two of the most widely used methods:

- **D'Hondt (Hondt)** method → favors larger parties.  
- **Sainte-Laguë** method (with optional modified 1.4 divisor) → more favorable to smaller parties.  

Perfect for elections, resource planning, employee distribution, or any case where fairness matters.

---

## ✨ Features

- **Customizable inputs**  
  - Add/remove any number of candidates or parties.  
  - Enter votes as raw numbers or percentages.  
  - Paste/upload CSV (`name,votes`).  

- **Flexible allocations**  
  - Choose total seats/resources to distribute.  
  - Supports elections, factory workforce splits, project allocations, and more.  

- **Multiple methods**  
  - D'Hondt (highest averages divisors 1,2,3,...)  
  - Sainte-Laguë (divisors 1,3,5,... with optional 1.4 first divisor).  

- **Interactive results**  
  - Animated bar charts for allocations.  
  - Ranked result tables with seat counts.  
  - Optional step-by-step quotient breakdown.  

- **Modern UI/UX**  
  - Clean CSS animations and responsive layout.  
  - Light/dark mode toggle.  
  - Accessible (keyboard navigation, screen-reader labels).  

- **Export & share**  
  - Export results as CSV.  
  - Copy/share permalink with encoded configuration.  
  - Print-friendly report view.  

---

## 🚀 Demo

Try the **live demo**:  
👉 [Ray Solver Live Website](https://ray-solver-proportional-allocation.vercel.app/) 

Preloaded sample:  
- **Votes**: A (34,000), B (27,000), C (16,000), D (8,000), E (4,000)  
- **Seats**: 10  
- Compare both D'Hondt and Sainte-Laguë outputs side by side.  

---

## 🛠️ Installation

Clone and run locally:

```bash
git clone https://github.com/your-username/ray-solver.git
cd ray-solver
```

### Run with static HTML/JS
Just open `index.html` in your browser.

### Run with local server (recommended)
```bash
# If you have Node.js installed
npx serve
```
Then open: `http://localhost:3000`

---

## 📖 Usage

1. Add your candidates/parties (name + votes).  
2. Enter total seats/resources to allocate.  
3. Pick a method: **D’Hondt** or **Sainte-Laguë**.  
4. View results in:  
   - Animated bar charts.  
   - Allocation tables.  
   - Optional step-by-step seat assignment breakdown.  
5. Export or share results.  

---

## 📊 Example Output

| Candidate | Votes  | % of Votes | Seats (D’Hondt) | Seats (Sainte-Laguë) |
|-----------|--------|------------|-----------------|-----------------------|
| A         | 34,000 | 34%        | 4               | 4                     |
| B         | 27,000 | 27%        | 3               | 3                     |
| C         | 16,000 | 16%        | 2               | 2                     |
| D         | 8,000  | 8%         | 1               | 1                     |
| E         | 4,000  | 4%         | 0               | 0                     |

---

## 🎨 Screenshots

<img width="658" height="503" alt="image" src="https://github.com/user-attachments/assets/8e647e34-7b09-4297-b6ac-080ac8796f9a" />
<img width="650" height="674" alt="image" src="https://github.com/user-attachments/assets/4f085efd-7925-4270-8b2f-d00b81630cd8" />
<img width="654" height="625" alt="image" src="https://github.com/user-attachments/assets/177a8378-7b6c-4181-b502-af3f804b3c28" />
<img width="657" height="766" alt="image" src="https://github.com/user-attachments/assets/fe4b24ff-0fe6-4b95-8099-fa9e1d2af5b6" />



---

## ⚡ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (or React, if used).  
- **Animations**: CSS transitions, keyframes.  
- **Data**: Pure JS implementation of D’Hondt and Sainte-Laguë.  
- **Deployment**: Vercek 

---

## ✅ Roadmap

- [ ] Sensitivity analysis (show allocations for 1..N seats).  
- [ ] Multilingual support.  
- [ ] More allocation methods (e.g., Largest Remainder / Hare-Niemeyer).  
- [ ] REST API backend for integration.  

---

## 🤝 Contributing

Contributions welcome!  
1. Fork the repo.  
2. Create a feature branch: `git checkout -b feature/my-feature`.  
3. Commit changes: `git commit -m 'Add feature'`.  
4. Push to branch: `git push origin feature/my-feature`.  
5. Open a pull request.  

---

## 📜 License

MIT License © 2025 [Rayzz]  
