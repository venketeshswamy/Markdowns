# AICITSS Advanced IT & Soft Skills
## Unit 1: Forensic Accounting & Fraud Detection
### Ch 1: Investigation
- **Definition**: <br/>Forensic Accountant = *Bloodhound* (Hunter) vs Auditor = *Watchdog*
- **Investigation Theories**
    - **Net Worth Theory** (Tax Evasion)
        - Formula: $Gross Income = \Delta Net Worth + Expenses$
        - $Unreported Income = Gross Income - Reported Income$
        - *Adjustment*: Deduct **Cash Hoarded** from Gross Income
    - **Expenditure Theory** (Spending Analysis)
        - Use case: No books, cash-based lifestyle
        - $Unreported Income = Total \ Cash \ Outflows - Reported \ Income$
- **Approaches**
    - **Financial Data**: Bank statements, Credit Cards, Tax Returns (26AS, AIS), Public Records
    - **Intelligence**: Surveillance, Informants, Trash covers, Background checks

### Ch 2: Legal & Standards (FAIS)
- **Regulatory Framework**
    - **Companies Act, 2013**: `Sec 447` (Fraud Definition), `Sec 213` (Investigation)
    - **PMLA 2002**: `Sec 3` (Money Laundering offense)
    - **IT Act 2000**: `Sec 43/44` (Data theft/damage) + 66C Identity theft + Hacking 66
    - **IPC**: `Sec 405` (Breach of Trust), `Sec 417` (Cheating) (Now BNS)
    - **SEBI Act empowers brokers or intermediaries investigation**
    - **`Section 33` of Insurance Act - Investigation of insurers**
    - **Income Tax Act** - "Cr I M E"
        - Cr `68` - Unexplained Cash Credits
        - I `69` - Unexplained investments
        - M `69A` - Unexplained Money
        - E `69C` - Unexplained Expense
- **FAIS Standards (ICAI)**
    - **100 Series (Basic)**: 
        - 110 (Nature)
        - 120 (Fraud Risk),
        - 130 (Laws),
        - 140 (Hypothesis)
    - **200 Series (Engagement)**: 
        - 210 (Objectives)
        - 220 (Acceptance and LOE), 
        - 230 (Expert Work Use), 
        - 240 (Engaging with agencies)
        - 250 (Stakeholders Communication)
    - **300 Series (Execution) *(Field Work)**: 
        - 310 (Planning),
        -  320 (Evidence)
        -  330 (Work Procedures)
        - 340 (Interviews),
        -  350 (Review of work),
        -  360 (Testifying in front of competent authority)
    - **400 Series - Specials**
        - 410 - Applying data Analytics
        - 420 Evidence gathering in digital domain
    - **500 Series**: 510 (Reporting Results)
    - **600 Series**: Quality Control (610)

### Ch 3: Fraud Schemes
- **Financial Statement Fraud**
    - **Time Manipulation**: Early revenue recognition, Postponing expenses
    - **Falsification**: Fictitious revenues, Liability omissions, Related party non-disclosure
    - **Red Flags**: Rapid growth > peers, Negative cash flow with positive profit
- **Specific Schemes**
    - **Ponzi**: Paying old investors with new money (e.g., *Bernie Madoff*)
    - **Pyramid**: Recruitment-based revenue or layered stuffs(e.g., *Amway cases*)
    - **Money Laundering**: Placement -> Layering -> Integration (e.g., *ICICI-Videocon*)

### Ch 4: Data Sources
- **Softwares**: `IDEA`, `NUIX`, `ScanWriter`
- **Portals**
    - **MCA**: Director relationships (DIN), Charges, Financials
    - **GST**: Filing frequency, Turnover mismatch
    - **Credit Reports**: `CIBIL`, `CRIF` (Loan history)
    - **Zauba Corp**: Import/Export data

### Ch 5: Prevention
- **Fraud Triangle**: Opportunity + Incentive + Rationalization
- **Fraud Diamond**: Triangle + **Capability** (Position/Intelligence to execute)

## Unit 2: Digital Forensics & Cyber Security
### Ch 1-3: Cyber Crimes & Attacks
- **Definitions**
    - **Cyber Crime** - Any attack to compromise the (CIA - Confidentiality, Integrity and Accessibility)
    - **Cyber Warfare**: Nation-state attacks (Espionage, Sabotage)
    - **Cyber Terrorism**: Intimidation via tech
- **Attack Vectors**
    - **Malware**: Virus (needs host), Worm (self-replicating), Trojan (disguised), Ransomware (encrypts data)
    - **Network**: DoS/DDoS (Availability attack), Man-in-the-Middle (Sniffing), Spoofing
    - **Social Engineering**: Phishing (Email), Vishing (Voice), Smishing (SMS)
- **Modus Operandi**:
    - 1. Reconnaissance -> 2. Weaponization -> 3. Delivery -> 4. Exploitation

### Ch 5: Forensic Process
- **1. Identification**: Scope, Legal authority
- **2. Preservation**: **Chain of Custody** (CoC), Write-blockers
    - *Rule*: Never work on original evidence; make **Bit-stream image**
- **3. Analysis**: Timeline analysis, file carving, keyword search
- **4. Documentation**: Notes, Hash values ($MD5$/$SHA1$)
- **5. Reporting**: Expert testimony, factual presentation

### Ch 7: Forensic Tools & OSINT
- **Forensic Tools**
    - **EnCase**: Disk imaging, analysis (Industry standard)
    - **FTK (Forensic Toolkit)**: Indexing, password recovery
    - **The Sleuth Kit/Autopsy**: Open source analysis
- **OSINT (Open Source Intelligence)**
    - `Shodan`: IoT device search
    - `Maltego`: Link analysis/Relationships
    - `The Harvester`: Email/Domain scraping
    - `Wayback Machine`: Historical web pages

### Ch 8: Auditing & Forensics
- **Convergence**: Using forensic tools for financial audit (e.g., verifying journal entry timestamps)
- **Techniques**:
    - **Benford's Law**: Detecting number anomalies
    - **Ratio Analysis**: Debt-to-Equity, Gross Margin trends