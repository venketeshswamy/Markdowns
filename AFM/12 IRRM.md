# Interest Rate Risk Management

## 🧠 Core Concepts
### Benchmark Rates
- Form basis for other interest rates
- Used in derivatives (FRAs, Swaps)
- Transition from LIBOR to ARRs
- ARRs are actual overnight transactions
- Secured ARRs: SOFR (USA), SARON (Swiss)
- Unsecured ARRs: SONIA (UK), €STER (Europe), TONAR (Japan)
- Indian Benchmarks: MIBOR (borrower pays), MIBID (bank borrows)

### Interest Rate Risk Types
- Gap Exposure: Mismatch in asset/liability re-pricing dates
- Basis Risk: Assets & liabilities benchmarked to different rates
- Embedded Option Risk: Prepayment of loans or premature withdrawals
- Yield Curve Risk: Non-parallel shifts in yield curve
- Price Risk: Inverse relation between bond prices & yields
- Reinvestment Risk: Uncertainty of reinvestment rate for future CFs

### Gap Analysis Concepts
- Positive Gap: RSA > RSL (NII rises if rates rise)
- Negative Gap: RSL > RSA (NII rises if rates fall)
- Earnings at Risk (EaR): Gap × Assumed Rate Change

### Hedging: Traditional Methods
- Asset & Liability Management (ALM)
- Forward Rate Agreements (FRAs)

### Hedging: Modern Methods
- Interest Rate Futures (IRF)
- Interest Rate Options (IRO / IRG)
- Interest Rate Swaps (IRS)
- Swaptions

## 📐 Formulas & Models
### Forward Rate Agreement (FRA)
- `Settlement = [(N) × (RR - FR) × (dtm/DY)] / [1 + RR(dtm/DY)]`
- `N` = Notional Principal
- `RR` = Reference Rate (Actual)
- `FR` = Forward Rate (Agreed)
- `dtm` = Days to maturity of forward rate
- `DY` = Day count basis (360 or 365)

### Interest Rate Options
- Cap Payoff: `N × max(0, r - rc) × (dt/DY)`
- Floor Payoff: `N × max(0, rf - r) × (dt/DY)`
- Collar Payoff: `Cap Payoff - Floor Payoff`
- `r` = Actual spot rate
- `rc` = Cap rate (Strike)
- `rf` = Floor rate (Strike)

### Interest Rate Futures (IRF)
- Delivery Price = `Conversion Factor × Futures Price`
- CTD Profit = `(Futures Settlement × CF) - Quoted Spot Price`

### Plain Vanilla Swap
- Semi-annual Fixed: `N × AIC × (180/360)`
- Floating Receipt: `N × R × (dt/360)`
- `AIC` = All-in-cost (fixed rate)

## 🔢 Step-by-Step Calculations
### FRA Settlement
- Step 1: Identify FRA period (e.g., 6x9 = starts in 6m, lasts 3m)
- Step 2: Calculate interest difference: `N × (Actual Rate - FRA Rate) × Period`
- Step 3: Discount using *Actual Rate* for the FRA period
- Step 4: Determine payer (If Actual > FRA, Seller pays Buyer)

### Cap Option Hedging
- Step 1: Calculate Upfront Premium (use PVAF if paid in installments)
- Step 2: Identify reset periods and actual benchmark rates
- Step 3: Exclude first period (rate already known)
- Step 4: For remaining periods, calculate compensation if Actual > Strike
- Step 5: Net Interest Cost = Actual Interest - Compensation + Premium

### Swap Cash Flows (OIS/Generic)
- Step 1: Calculate fixed leg payment using AIC and specific days
- Step 2: Calculate floating leg using actual daily benchmark rates
- Step 3: Compute net settlement amount
- Step 4: Fixed payer pays if Fixed > Floating

## ⚠️ Pitfalls, Traps & Examiner Tricks
- ⚠️ **FRA Discounting:** ALWAYS discount FRA payoff at the *Actual* Reference Rate.
- ⚠️ **FRA Settlement Timing:** Settled at the *beginning* of the period, not maturity.
- ⚠️ **Cap First Period:** First period is usually excluded from payoff calculations.
- ⚠️ **Day Count Conventions:** Check if question specifies 360 or 365 days. 
- ⚠️ **OIS Swaps:** Sunday/Holiday rates carry over from previous Friday/working day.
- ⚠️ **Notional Principal:** Never actually exchanged in FRAs or pure IRS.
- ⚠️ **Premium Amortization:** Cap premium is paid upfront, don't forget its time value.
- ⚠️ **Quote Interpretation:** 1x4 FRA means fixed after 1 month, lasting 3 months.

## 🔗 Inter-topic Links & Dependencies
- 🔗 **Forex:** Currency swaps link deeply with foreign exchange risk management.
- 🔗 **Derivatives:** Cap = Call Option, Floor = Put Option.
- 🔗 **Derivatives:** Forward/Futures pricing concepts apply to IRFs.
- 🔗 **Bond Valuation:** Inverse relationship between yield and bond price underpins IRFs.

## 📝 Key ICAI Definitions
- **FRA:** Agreement where borrower/lender protects from unfavorable changes to interest rate.
- **Basis Risk:** Risk that interest rate of different assets/liabilities change in different magnitudes.
- **Cheapest to Deliver (CTD):** Bond that minimizes difference between quoted spot and adjusted futures price.
- **Cap Option:** Protects buyer against rising rates; pays when index > cap rate.
- **Swaption:** Option giving right but not obligation to enter an interest rate swap.

## 🎯 Exam-Focused Points
- ★ FRA net settlement calculations (Highly tested).
- ★ Plain Vanilla vs Basis Swap vs Currency Swap calculations.
- ★ OIS (Overnight Index Swap) daily interest compounding/addition.
- ★ Cap option payoffs combined with base loan interest.
- ★ Conversion factor application in IRF delivery.

## 🧩 Logic Behind Answers
- **Why discount FRA payoff?** It compensates for interest over the *future* period but is paid *today*.
- **Why zero-cost collar?** Premium earned from selling floor exactly offsets cap premium.
- **Why exclude first cap period?** Current spot rate is already known; no uncertainty to hedge.
- **Why CTD matters?** Short position seller maximizes profit by delivering the cheapest eligible bond.

## 📊 Decision Rules & Shortcuts
### Interest Rate View: Rising
- FRA: Buy FRA (Pay Fixed, Receive Float)
- Options: Buy Cap
- IRF: Sell Futures
- Swap: Pay Fixed, Receive Floating
- Swaption: Buy Payer Swaption (Call)

### Interest Rate View: Falling
- FRA: Sell FRA (Receive Fixed, Pay Float)
- Options: Buy Floor
- IRF: Buy Futures
- Swap: Receive Fixed, Pay Floating
- Swaption: Buy Receiver Swaption (Put)

## 🚨 Last-Minute Revision Nodes
- FRA Formula: `(N*(RR-FR)*(d/360)) / (1+RR*(d/360))`
- Cap = Call on Rates; Floor = Put on Rates
- Collar = Buy Cap + Sell Floor
- Swaps: Fixed vs Floating net settlement
- 1x4 FRA = Starts in 1m, Ends in 4m (Tenor = 3m)
- CTD = Max(Futures Settlement × CF - Spot Price)
- ARRs = Unsecured (SONIA, TONAR) vs Secured (SOFR, SARON)