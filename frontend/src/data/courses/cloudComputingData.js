// Cloud Computing Complete Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "cc-phase-1",
    title: "Phase 1: Cloud Architecture, Networks & Storage (Weeks 1–2)",
    description: "Master the foundations of cloud deployment models, hypervisor virtualization, AWS regions, VPC subnetting, and block/object storage.",
    modules: [
      {
        id: "cc-m-1",
        title: "Module 1: Introduction to Cloud & Virtualization",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Differentiate IaaS, PaaS, and SaaS models",
          "Analyze public, private, hybrid, and multi-cloud configurations",
          "Explain hypervisor virtualization layers",
          "Configure core virtual machine compute instances"
        ],
        lessons: [
          {
            id: "cc-l-1-1",
            title: "Cloud Service Models",
            time: "40 min",
            summary: "IaaS (Infrastructure as a Service), PaaS (Platform as a Service), and SaaS (Software as a Service)",
            content: `
### Cloud Service Models

Cloud computing provides IT resources on-demand over the internet with pay-as-you-go pricing. These resources are grouped into three primary service models: IaaS, PaaS, and SaaS.

#### The Shared Responsibility Models:
1.  **IaaS (Infrastructure as a Service):** You rent fundamental computing resources—like virtual servers, networking hardware, and raw storage (e.g., AWS EC2, Google Compute Engine).
    *   *You manage:* Operating System, middleware, runtime, data, and applications.
    *   *Provider manages:* Physical servers, virtualization layer, storage disks, and networking cables.
2.  **PaaS (Platform as a Service):** The provider manages the operating system, database databases, and runtimes. You focus entirely on deploying application code (e.g., Heroku, AWS Elastic Beanstalk).
    *   *You manage:* Code and data configurations.
    *   *Provider manages:* OS updates, scalability, patches, and hardware maintenance.
3.  **SaaS (Software as a Service):** A complete, ready-to-use software application accessed via web browser (e.g., Google Workspace, Salesforce, Notion).
    *   *You manage:* Basic user settings.
    *   *Provider manages:* The entire software stack.

#### Real-World Example:
Think of the "Pizza as a Service" analogy:
*   **IaaS:** You buy frozen pizza (infrastructure). You supply the oven, gas, and table.
*   **PaaS:** Pizza delivery (platform). The pizzeria bakes it and delivers it; you just set the table.
*   **SaaS:** Dining out (software). You go to a restaurant, order, eat, and pay. The restaurant handles everything.

#### Quiz Questions:
1. **Which cloud service model provides virtual servers where you must install and manage the operating system?**
   *   a) SaaS
   *   b) PaaS
   *   c) IaaS (Correct)
2. **Heroku and AWS Elastic Beanstalk are examples of which model?**
   *   a) PaaS (Correct)
   *   b) SaaS
   *   c) IaaS

#### Interview Questions:
* **How does the level of control shift between IaaS, PaaS, and SaaS?**
  *   *Answer:* IaaS offers maximum control but requires maximum management effort (configuring OS, patching, networking). PaaS decreases control in favor of rapid deployment (developer focuses on code). SaaS offers zero control over infrastructure, serving as a ready-to-use end-product.
* **Why would a startup choose PaaS over IaaS during early MVP development?**
  *   *Answer:* PaaS minimizes administrative overhead. Developers do not waste time configuring OS environments, firewalls, and updates, enabling them to ship code faster and scale automatically.

#### Summary:
Cloud models define the level of management responsibility. IaaS offers raw virtual machines, PaaS manages runtimes for code deployment, and SaaS delivers ready-to-use software.
            `,
            exercise: "Write a short paragraph analyzing which service model is best suited for a team building a custom ML model that requires GPU driver optimizations."
          },
          {
            id: "cc-l-1-2",
            title: "Deployment Models",
            time: "45 min",
            summary: "Public, private, hybrid, and multi-cloud deployment strategies.",
            content: `
### Cloud Deployment Models

Cloud deployment models define where resources are located, who owns them, and who has access to them.

#### The Four Deployment Models:
1.  **Public Cloud:** Computing resources are owned and operated by a third-party cloud service provider (e.g., AWS, GCP, Microsoft Azure) and shared with other tenants over the public internet.
2.  **Private Cloud:** Infrastructure is dedicated to a single business or organization. It can be hosted on-premise in the company's datacenter or managed by a third party.
3.  **Hybrid Cloud:** Combines public and private clouds, allowing data and applications to be shared between them. A common pattern is hosting database records in a private cloud and using public cloud virtual machines for compute scaling.
4.  **Multi-Cloud:** Using services from multiple independent public cloud providers (e.g., hosting frontends on AWS and analytics engines on GCP) to avoid vendor lock-in.

#### Real-World Example:
A commercial bank hosts customer account ledgers on a private on-premise cloud to meet regulatory security guidelines. However, it uses a public cloud like AWS to power its mobile banking app frontend, allowing it to scale dynamically during pay-day traffic spikes. This hybrid architecture merges security with scalability.

#### Quiz Questions:
1. **Which deployment model combines on-premises datacenters with public cloud services?**
   *   a) Private Cloud
   *   b) Multi-Cloud
   *   c) Hybrid Cloud (Correct)
2. **What is a primary motivation for adopting a multi-cloud strategy?**
   *   a) Reducing network bandwidth
   *   b) Avoiding vendor lock-in and improving redundancy (Correct)
   *   c) Eliminating the need for internet routing

#### Interview Questions:
* **What are the primary differences between Public Cloud and Private Cloud regarding CapEx and OpEx?**
  *   *Answer:* Public clouds operate on an OpEx model (operational expenditure), where you pay only for what you consume. Private clouds on-premises require large CapEx (capital expenditure) to purchase physical servers, datacenters, cooling systems, and networking hardware upfront.
* **Describe a scenario where a company might prefer a Hybrid Cloud deployment.**
  *   *Answer:* A hospital database system containing sensitive patient health records (PHI) must be stored in a private cloud to comply with HIPAA regulations. However, the hospital can use public cloud APIs to run non-sensitive scheduling services, utilizing a hybrid connection.

#### Summary:
Public clouds share resources among tenants dynamically. Private clouds isolate hardware for a single client. Hybrid clouds bridge public and private resources, while multi-cloud uses multiple public vendors.
            `,
            exercise: "Draw a system diagram displaying how a company can connect an on-premise private datacenter to a public AWS network using a VPN connection."
          },
          {
            id: "cc-l-1-3",
            title: "Virtualization & Hypervisors",
            time: "50 min",
            summary: "Hypervisor virtualization layers, Type 1 vs Type 2 hypervisors, and container differences.",
            content: `
### Virtualization & Hypervisors

Virtualization is the core technology that enables cloud computing. It allows a single physical computer to host multiple virtual computers (Virtual Machines or VMs) by dividing hardware resources.

#### The Hypervisor:
A **Hypervisor** (or Virtual Machine Monitor) is the software layer that creates, runs, and manages virtual machines. It intercepts calls from the VM's guest OS to physical CPU, memory, and disk resources.

#### Hypervisor Types:
1.  **Type 1 (Bare-Metal):** Runs directly on the host computer's physical hardware. It is highly efficient and used in enterprise datacenters (e.g., VMware ESXi, KVM, Microsoft Hyper-V).
2.  **Type 2 (Hosted):** Runs as an application on top of an existing host operating system (e.g., VirtualBox, VMware Workstation). Ideal for local development environments.

#### Architecture Model:
\`\`\`
Type 1 (Enterprise)              Type 2 (Hosted/Local)
+-----------------------+         +-----------------------+
|  Virtual Machines     |         |  Virtual Machines     |
+-----------------------+         +-----------------------+
|  Hypervisor Layer     |         |  Hypervisor App       |
+-----------------------+         +-----------------------+
|  Bare-Metal Hardware  |         |  Host OS (Win/Mac)    |
+-----------------------+         +-----------------------+
                                  |  Bare-Metal Hardware  |
                                  +-----------------------+
\`\`\`

#### Quiz Questions:
1. **Which hypervisor type runs directly on physical server hardware without a host operating system?**
   *   a) Type 2 Hypervisor
   *   b) Type 1 Hypervisor (Correct)
   *   c) Container Engine
2. **What is KVM (Kernel-based Virtual Machine) classified as?**
   *   a) Type 1 Hypervisor (Correct)
   *   b) Type 2 Hypervisor
   *   c) Software as a Service

#### Interview Questions:
* **How does virtualization differ from containerization?**
  *   *Answer:* Virtualization abstracts hardware, meaning each VM runs a complete guest operating system, including its own kernel. Containerization abstracts the operating system, meaning containers share the host OS kernel, making them lightweight and faster to boot.
* **Explain how CPU overcommit works in hypervisors.**
  *   *Answer:* Hypervisors assign more virtual CPUs (vCPUs) to VMs than the physical CPU cores available on the host. This assumes that not all VMs will run at 100% CPU utilization simultaneously, allowing resources to be allocated dynamically.

#### Summary:
Virtualization splits physical hardware into isolated virtual machines. Hypervisors manage this allocation, operating either as bare-metal software (Type 1) or hosted OS applications (Type 2).
            `,
            exercise: "List the VM hypervisors you have used in your local development (e.g. WSL2, VirtualBox) and identify if they are Type 1 or Type 2."
          },
          {
            id: "cc-l-1-4",
            title: "Regions & Availability Zones",
            time: "45 min",
            summary: "Global infrastructure layout, cloud regions, availability zones, and latency profiles.",
            content: `
### Regions & Availability Zones

Public cloud providers locate physical datacenters globally. Understanding this infrastructure layout is critical to building fault-tolerant, high-performance applications.

#### Key Infrastructures:
*   **Region:** A physical location in the world where a cloud provider hosts datacenters (e.g., \`us-east-1\` in N. Virginia, \`eu-west-1\` in Ireland). Regions are isolated from each other to prevent cascade failures.
*   **Availability Zone (AZ):** One or more discrete datacenters within a region, equipped with redundant power, networking, and cooling. AZs are separated by miles to isolate local natural disasters (floods, fires) but connected by high-speed fiber networks.
*   **Edge Locations:** Small cache datacenters deployed close to users to deliver cached media content with low latency (used by CDNs like CloudFront).

#### Design Pattern:
To build a highly available application, deploy server instances in multiple Availability Zones within a region. If one AZ experiences a power grid failure, the application load balancer automatically routes traffic to the other active AZ.

#### Quiz Questions:
1. **What is an Availability Zone (AZ)?**
   *   a) A global continent database
   *   b) One or more discrete datacenters with independent power and networking in a region (Correct)
   *   c) A virtual private cloud subnetwork
2. **To keep latency lowest for users in Tokyo, where should you deploy your cloud compute instances?**
   *   a) us-east-1 (N. Virginia)
   *   b) ap-northeast-1 (Tokyo) (Correct)
   *   c) eu-central-1 (Frankfurt)

#### Interview Questions:
* **Why does a region always consist of at least three Availability Zones?**
  *   *Answer:* Consisting of multiple AZs allows systems to run distributed database consensus protocols (requiring a majority vote, like Raft or Paxos) to elect a primary node even if one zone goes offline.
* **How do Edge Locations differ from Availability Zones?**
  *   *Answer:* Availability Zones host primary compute and database services. Edge Locations do not run full databases; they are caching servers located globally to deliver static files and assets to users with minimal latency.

#### Summary:
Regions represent global physical locations containing multiple isolated Availability Zones. Deploying across multiple AZs ensures application high availability.
            `,
            exercise: "Open your terminal and use the AWS CLI or GCP gcloud CLI command to list all available regions and zones for your cloud account."
          },
          {
            id: "cc-l-1-5",
            title: "Compute Services: EC2 & Virtual Machines",
            time: "50 min",
            summary: "Provisioning virtual machines, instance pricing models, and instance configurations.",
            content: `
### Compute Services: EC2 & Virtual Machines

Virtual server instances (like Amazon EC2 or Azure Virtual Machines) are the fundamental compute building blocks of cloud infrastructure.

#### VM Instance Configurations:
*   **AMI (Amazon Machine Image):** A template containing the operating system, pre-installed software, and configurations (e.g., Ubuntu, Amazon Linux).
*   **Instance Type:** Specifies the CPU, memory, storage, and network capacity (e.g., \`t3.micro\` is a low-cost instance, \`c5.xlarge\` is optimized for compute-heavy workloads).

#### Pricing Models:
1.  **On-Demand:** Pay by the second or hour with no long-term commitment. Expensive but flexible.
2.  **Reserved Instances (RI) / Savings Plans:** Commit to a 1 or 3-year term for up to a 72% discount. Best for steady-state workloads.
3.  **Spot Instances:** Bid for unused cloud capacity. Up to 90% cheaper, but the provider can terminate the instance with a 2-minute warning. Best for batch processing.

#### Provisioning CLI Example (AWS CLI):
\`\`\`bash
# Launch an Ubuntu instance on AWS:
aws ec2 run-instances \
    --image-id ami-0fc5d935ebf8bc3bc \
    --count 1 \
    --instance-type t2.micro \
    --key-name MyKeyPair \
    --security-group-ids sg-903004fa
\`\`\`

#### Quiz Questions:
1. **Which EC2 pricing model is ideal for a batch analytics workload that can be interrupted at any time?**
   *   a) Reserved Instances
   *   b) On-Demand
   *   c) Spot Instances (Correct)
2. **What is an AMI (Amazon Machine Image)?**
   *   a) A database backup file
   *   b) A pre-configured template containing the OS and application configurations to launch a VM (Correct)
   *   c) A load balancing script

#### Interview Questions:
* **Explain when you would choose Spot Instances over On-Demand Instances.**
  *   *Answer:* Spot instances are used for fault-tolerant, interruptible workloads like big data processing, image rendering, or CI/CD testing, where losing a node won't break the queue. On-Demand is used when uptime is critical and workloads cannot afford interruption.
* **What parameters are defined by an instance type (e.g., t3.medium)?**
  *   *Answer:* The instance type defines the hardware configuration of the VM: the number of virtual CPUs (vCPUs), physical memory size (RAM), local storage capacity, and network interface bandwidth.

#### Summary:
Virtual compute instances are built using pre-configured OS images (AMIs) and allocated hardware profiles. Spot, Reserved, and On-Demand pricing allow cost optimization.
            `,
            exercise: "Draft an EC2 launch template configuration specifying an Ubuntu OS, t3.micro size, and 20GB of SSD block storage."
          }
        ]
      },
      {
        id: "cc-m-2",
        title: "Module 2: Networking & Storage Systems",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Configure Virtual Private Cloud (VPC) subnets and route tables",
          "Secure network layers using Security Groups and NACLs",
          "Provision Object Storage buckets and write access policies",
          "Differentiate Block, File, and Managed Database options"
        ],
        lessons: [
          {
            id: "cc-l-2-1",
            title: "Virtual Private Cloud (VPC) Networking",
            time: "55 min",
            summary: "Isolated virtual networks, CIDR block allocation, public vs private subnets, and route tables.",
            content: `
### Virtual Private Cloud (VPC) Networking

A VPC is a logically isolated virtual network dedicated to your cloud account. It gives you complete control over your network topology, subnets, and routing.

#### Core VPC Components:
*   **CIDR Block (Classless Inter-Domain Routing):** The IP address range allocated to the VPC (e.g., \`10.0.0.0/16\` provides 65,536 private IP addresses).
*   **Subnet:** A segment of the VPC's IP range. Subnets are bound to specific Availability Zones:
    1.  **Public Subnet:** Connected to an **Internet Gateway (IGW)**. Instances have public IPs and can talk to the internet.
    2.  **Private Subnet:** Isolated from the internet. Instances only have private IPs.
*   **Route Table:** A set of routing rules determining where network traffic is directed.
*   **NAT Gateway (Network Address Translation):** Placed in a public subnet. Allows instances in a private subnet to securely download updates from the internet without exposing them to incoming connections.

#### Network Topology Diagram:
\`\`\`
+-----------------------------------------------------------+
| VPC (CIDR: 10.0.0.0/16)                                  |
|   +-----------------------+   +-----------------------+   |
|   | Public Subnet (10.0.1.|   | Private Subnet (10.0.2|   |
|   | [Web VM]              |   | [Database VM]         |   |
|   |   |                   |   |   |                   |   |
|   +---|-------------------+   +---|-------------------+   |
|       v                           v                       |
|   Internet Gateway (IGW) <=== NAT Gateway                 |
+-------|---------------------------------------------------+
        v
 [Public Internet]
\`\`\`

#### Quiz Questions:
1. **Which VPC component allows instances in a private subnet to connect to the internet to download updates while blocking incoming requests?**
   *   a) Internet Gateway
   *   b) NAT Gateway (Correct)
   *   c) Route Table
2. **What does a CIDR block of '10.0.0.0/24' represent?**
   *   a) A range containing 256 IP addresses (Correct)
   *   b) A single IP address
   *   c) An entire cloud region

#### Interview Questions:
* **How do you make a subnet public in a VPC?**
  *   *Answer:* You must attach an Internet Gateway to the VPC, and update the subnet's Route Table to direct default external traffic (\`0.0.0.0/0\`) to that Internet Gateway interface.
* **Why should database servers always be deployed in private subnets?**
  *   *Answer:* Security. Database servers contain sensitive data and should not be directly accessible from the public internet. Placed in a private subnet, they can only receive connections from frontend servers running within the VPC network.

#### Summary:
VPCs isolate virtual networks using CIDR ranges. Subnets divide this space into public segments connected to the internet and private segments secured behind NAT gateways.
            `,
            exercise: "Calculate the total number of usable host IP addresses in a /28 subnet CIDR block (remembering that cloud providers reserve 5 IPs)."
          },
          {
            id: "cc-l-2-2",
            title: "Cloud Firewalls & Security Groups",
            time: "50 min",
            summary: "Stateful Security Groups vs stateless Network Access Control Lists (NACLs) rules.",
            content: `
### Cloud Firewalls & Security Groups

Cloud providers secure networks using firewall rules at two distinct levels: the instance level (**Security Groups**) and the subnet level (**Network Access Control Lists** or **NACLs**).

#### Stateful vs. Stateless Firewalls:
1.  **Security Groups (Instance Level):**
    *   **Stateful:** If you send an outbound request, inbound return traffic is automatically allowed, regardless of inbound rules.
    *   **Rules:** Supports "allow" rules only. All traffic is blocked by default.
2.  **NACLs (Subnet Level):**
    *   **Stateless:** You must explicitly create both inbound and outbound rules to allow return traffic.
    *   **Rules:** Supports both "allow" and "deny" rules. Processes rules in numerical order.

#### Rule Comparison Matrix:
| Feature | Security Group (SG) | Network ACL (NACL) |
| :--- | :--- | :--- |
| **Operates At** | Instance Level | Subnet Level |
| **State** | Stateful | Stateless |
| **Rule Types** | Allow only | Allow and Deny |
| **Evaluation** | All rules evaluated | Evaluated in order |

#### Quiz Questions:
1. **If you open port 80 outbound in a stateful Security Group, do you need an inbound rule to receive the response?**
   *   a) Yes, because it is stateless
   *   b) No, because stateful firewalls track connections and allow response packets back automatically (Correct)
   *   c) No, because port 80 is public
2. **Which security layer operates at the subnet boundary and supports explicit 'deny' rules?**
   *   a) Security Group
   *   b) Network ACL (NACL) (Correct)
   *   c) IAM Role

#### Interview Questions:
* **Explain the stateless nature of NACLs.**
  *   *Answer:* Stateless means the firewall does not track connection state. If an inbound request is allowed on port 80, the outgoing response is blocked unless an explicit outbound rule allows traffic on ephemeral ports (typically 1024-65535) back to the client.
* **How would you block a specific malicious IP address from attacking your servers?**
  *   *Answer:* You would configure a rule in the Network ACL (NACL) with a "Deny" action targeting that specific IP address block, since Security Groups do not support deny rules.

#### Summary:
Security Groups act as stateful instance-level firewalls. NACLs act as stateless subnet-level firewalls. Combining them secures both the network perimeter and host servers.
            `,
            exercise: "Write a security group rule configuration (port, protocol, source) that allows public HTTP web traffic but restricts SSH management access to your office IP: 198.51.100.4."
          },
          {
            id: "cc-l-2-3",
            title: "Object Storage (Amazon S3)",
            time: "50 min",
            summary: "Unstructured file storage, buckets, keys, partition scalability, and storage class costs.",
            content: `
### Object Storage (Amazon S3)

Object storage stores files as "objects" rather than blocks or directory trees. It is highly scalable and ideal for unstructured data (images, videos, backups).

#### Core Concepts:
*   **Bucket:** A container for objects. Bucket names must be globally unique across all cloud accounts.
*   **Object:** A file consisting of **Key** (the file path/name), **Value** (the raw data bytes), and **Metadata** (headers like content-type).
*   **Storage Classes:** To optimize costs, S3 offers tiers:
    1.  **Standard:** Active access, high speed.
    2.  **Standard-IA (Infrequent Access):** Cheaper storage, but fees apply for data retrieval.
    3.  **Glacier (Archive):** Deep archives with low costs, but retrieval takes minutes to hours.

#### Bucket Access Policy Example (JSON):
This policy allows public read access to a bucket:
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-unique-assets-bucket/*"
    }
  ]
}
\`\`\`

#### Quiz Questions:
1. **Which storage tier is most cost-effective for data backups that must be preserved for 7 years but are rarely accessed?**
   *   a) S3 Standard
   *   b) S3 Glacier (Correct)
   *   c) S3 Standard-IA
2. **What must be unique about a cloud object storage bucket?**
   *   a) Its name must be globally unique across all users (Correct)
   *   b) Its private IP address
   *   c) The size of individual files

#### Interview Questions:
* **How does Object Storage differ from Block Storage?**
  *   *Answer:* Object storage manages data as flat files with metadata, accessed via API endpoints (HTTP GET/PUT), which scales infinitely. Block storage mounts raw disk sectors to a single operating system, behaving like a local physical hard drive.
* **What are S3 Lifecycle Policies?**
  *   *Answer:* Lifecycle policies automate data management. For example, they can transition objects from Standard to Infrequent Access after 30 days, to Glacier after 90 days, and delete them permanently after 365 days, saving costs.

#### Summary:
Object storage organizes unstructured files as key-value objects in globally unique buckets. Storage tiers like Glacier optimize costs for archiving.
            `,
            exercise: "Write a policy that grants write-only (s3:PutObject) permissions to a specific IAM user account for a bucket named 'user-uploads-bucket'."
          },
          {
            id: "cc-l-2-4",
            title: "Block Storage vs File Storage",
            time: "45 min",
            summary: "Amazon EBS volumes, EFS network shares, SAN vs NAS, and IOPS configurations.",
            content: `
### Block Storage vs File Storage

Different workloads require different storage architectures. Choosing between block storage and file storage depends on performance needs and access patterns.

#### 1. Block Storage (Amazon EBS, Azure Disk):
*   Acts as a raw, unformatted hard drive volume.
*   Must be mounted to a single server instance at a time.
*   **Use Cases:** Operating systems, high-performance database files (low-latency read/write).
*   **Metrics:** Measured in IOPS (Input/Output Operations Per Second).

#### 2. File Storage (Amazon EFS, Azure Files):
*   Acts as a shared network drive (NAS) using NFS/SMB protocols.
*   Can be mounted to hundreds of compute instances simultaneously.
*   **Use Cases:** Shared configuration folders, web hosting assets, user home directories.
*   **Metrics:** Scalable throughput.

#### Storage Architecture Comparison:
\`\`\`
Block Storage (EBS)                File Storage (EFS)
+---------+                        +---------+     +---------+
| Web VM  |<-- Mounted Disk        | Web VM1 |     | Web VM2 |
+---------+                        +---------+     +---------+
     |                                  \             /
+-------------------+                  +-------------------+
| Raw Block Volume  |                  | Shared NFS Share  |
+-------------------+                  +-------------------+
\`\`\`

#### Quiz Questions:
1. **Which storage system allows multiple compute instances to mount and write to the same directory simultaneously?**
   *   a) EBS Volume
   *   b) S3 Bucket
   *   c) EFS Shared Drive (Correct)
2. **What does IOPS measure?**
   *   a) The speed of internet connections
   *   b) The read and write performance of block storage disks (Correct)
   *   c) The network packet routing limits

#### Interview Questions:
* **If you are hosting a MySQL database, would you store the database files on EBS or EFS, and why?**
  *   *Answer:* You would store them on EBS block storage. Databases require low latency and high IOPS for transaction logs. EFS has higher network latency due to being a shared filesystem, which would slow down database operations.
* **What are provisioned IOPS (gp3/io2) in block storage?**
  *   *Answer:* Provisioned IOPS allow you to buy dedicated read/write performance independently of the drive storage capacity. This is critical for high-throughput applications that need consistent disk speed.

#### Summary:
Block storage provides raw disk access mounted to single instances, making it ideal for databases. File storage shares filesystems across multiple nodes.
            `,
            exercise: "Outline the commands to initialize, format with ext4, and mount an empty EBS block volume onto a Linux operating system directory."
          },
          {
            id: "cc-l-2-5",
            title: "Databases in the Cloud",
            time: "50 min",
            summary: "Relational (RDS) vs Non-Relational (NoSQL DynamoDB) engines, read replicas, and failover automation.",
            content: `
### Databases in the Cloud

Managing databases requires balancing administrative overhead, scalability, and latency. Cloud providers offer managed database engines to simplify operations.

#### Managed Database Options:
1.  **Relational Database Service (RDS, Cloud SQL):**
    *   **Engines:** MySQL, PostgreSQL, Oracle, SQL Server.
    *   **Features:** Automated patching, backups, and failovers.
    *   **Scalability:** Uses **Read Replicas** to offload read traffic, and Multi-AZ replication for failover backup.
2.  **NoSQL Database (Amazon DynamoDB, Cloud Bigtable):**
    *   **Engines:** Key-value document stores.
    *   **Features:** Serverless, schema-less, and scales horizontally to handle millions of queries with single-digit millisecond latency.
    *   **Scalability:** Auto-scales throughput globally.

#### High Availability Failover (Multi-AZ):
When you enable Multi-AZ, the database engine synchronizes data to a secondary database instance in another zone. If the primary database crashes, the provider automatically updates the DNS alias pointer, routing application requests to the secondary database.

#### Quiz Questions:
1. **What is the primary benefit of deploying an RDS database in a Multi-AZ configuration?**
   *   a) Shading data tables
   *   b) High availability and automatic disaster recovery failover (Correct)
   *   c) Faster read speeds
2. **Which database type is DynamoDB?**
   *   a) Relational (SQL)
   *   b) NoSQL Document Store (Correct)
   *   c) Object Database

#### Interview Questions:
* **How do Read Replicas differ from Multi-AZ deployments in managed databases?**
  *   *Answer:* Read Replicas replication is asynchronous, designed to scale read traffic performance. Multi-AZ replication is synchronous, designed for disaster recovery and high availability; it cannot be used to serve read queries.
* **Why would a developer choose a managed serverless database like DynamoDB over hosting MongoDB on an EC2 instance?**
  *   *Answer:* Managed DynamoDB eliminates operating system patching, server scaling config, backup tasks, and disk provisioning. It scales automatically, charging only for read/write requests.

#### Summary:
Managed database services automate backups and high availability. RDS hosts relational SQL databases with failovers, while NoSQL databases scale horizontally.
            `,
            exercise: "Configure a database client connection string template, demonstrating how DNS endpoints replace IP addresses when connecting to managed databases."
          }
        ]
      }
    ]
  },
  {
    id: "cc-phase-2",
    title: "Phase 2: IAM Security, DevOps & Serverless Architecture (Weeks 3–4)",
    description: "Design IAM security policies, balance network traffic, configure elasticity, deploy Lambda serverless, write IaC templates, and optimize billing.",
    modules: [
      {
        id: "cc-m-3",
        title: "Module 3: IAM, Scaling & High Availability",
        duration: "1 Week",
        difficulty: "Intermediate-Advanced",
        objectives: [
          "Apply Principle of Least Privilege in IAM Policies",
          "Distribute network loads using Elastic Load Balancers",
          "Configure Auto-Scaling groups for horizontal elasticity",
          "Define recovery thresholds (RTO and RPO) for high availability"
        ],
        lessons: [
          {
            id: "cc-l-3-1",
            title: "Identity & Access Management (IAM)",
            time: "50 min",
            summary: "Users, groups, roles, and JSON policies. Adhering to the Principle of Least Privilege.",
            content: `
### Identity & Access Management (IAM)

IAM is the security gatekeeper of your cloud account. It controls authentication (proving who you are) and authorization (proving what permissions you have).

#### Core IAM Elements:
1.  **IAM User:** A physical person or application console log account (credentials: username/password or access keys).
2.  **IAM Group:** A collection of users (e.g., "Developers"). Permissions attached to the group apply to all members.
3.  **IAM Role:** An identity with permissions that can be assumed by anyone who needs it, usually cloud services (e.g., allowing an EC2 instance to read an S3 bucket).
4.  **IAM Policy:** A JSON document defining permissions.

#### JSON Policy Example (Least Privilege):
This policy allows reading objects from a specific S3 bucket only:
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::my-secure-data-bucket/*"
    }
  ]
}
\`\`\`

#### Quiz Questions:
1. **Which IAM entity should you use to grant an EC2 server instance temporary access to write data to an S3 bucket?**
   *   a) IAM User
   *   b) IAM Role (Correct)
   *   c) IAM Group
2. **What does the Principle of Least Privilege mean?**
   *   a) Giving everyone admin privileges
   *   b) Granting only the minimum permissions required to perform a task (Correct)
   *   c) Revoking all network access

#### Interview Questions:
* **What is the difference between an IAM User and an IAM Role?**
  *   *Answer:* An IAM User is a permanent identity associated with a specific person or service, using static credentials. An IAM Role is assumed temporarily by users, applications, or services, using temporary security tokens.
* **Why should you avoid using the root user account for daily administration tasks?**
  *   *Answer:* The root user has unrestricted access to all resources and billing data. If root credentials are compromised, the entire account can be stolen. Daily tasks should be performed by IAM users granted limited permissions.

#### Summary:
IAM manages authentication and authorization. JSON policies define permissions, and IAM Roles grant temporary access to compute instances securely.
            `,
            exercise: "Write an IAM policy in JSON that allows a user to start, stop, and reboot EC2 instances, but blocks them from terminating (deleting) instances."
          },
          {
            id: "cc-l-3-2",
            title: "Load Balancing",
            time: "50 min",
            summary: "Application (Layer 7) vs Network (Layer 4) load balancers, health checks, and path routing.",
            content: `
### Load Balancing

Load balancers act as traffic cops, distributing incoming application traffic across multiple target servers (like EC2 instances or containers) to ensure high availability and prevent overload.

#### Types of Load Balancers (AWS ELB):
1.  **Application Load Balancer (ALB - Layer 7):**
    *   Inspects HTTP/HTTPS headers.
    *   **Features:** Path-based routing (e.g., routing \`/api\` to one server group, \`/images\` to another) and SSL termination.
2.  **Network Load Balancer (NLB - Layer 4):**
    *   Inspects TCP/UDP layer details.
    *   **Features:** Ultra-high performance, routes millions of requests per second with ultra-low latency, uses static IP addresses.

#### Health Checks:
Load balancers send periodic ping requests to targets (e.g., checking \`HTTP GET /health\`). If a server fails to respond, it is marked unhealthy, and the load balancer stops routing traffic to it until it passes health checks again.

#### Quiz Questions:
1. **Which load balancer type is best suited for routing traffic based on HTTP URL path endpoints?**
   *   a) Network Load Balancer (NLB)
   *   b) Application Load Balancer (ALB) (Correct)
   *   c) Classic Bridge Router
2. **What happens when a load balancer's health check fails on a target server?**
   *   a) The load balancer terminates the server instance
   *   b) The load balancer routes double the traffic to it
   *   c) The load balancer routes traffic to other healthy servers (Correct)

#### Interview Questions:
* **How does SSL termination on a load balancer save CPU resources on backend servers?**
  *   *Answer:* Encrypting and decrypting SSL traffic is CPU-intensive. By terminating SSL at the load balancer, backend servers process only decrypted HTTP traffic, saving computing power.
* **Explain the difference between Layer 4 and Layer 7 load balancing.**
  *   *Answer:* Layer 4 (Network) load balancing routes traffic based on IP address and port protocols (TCP/UDP), without inspecting payload contents. Layer 7 (Application) load balancing inspects HTTP/HTTPS headers, cookies, and URLs to make routing decisions.

#### Summary:
Load balancers distribute traffic across servers. ALBs inspect application headers for path routing, while NLBs route network traffic with low latency. Health checks ensure traffic is sent to working nodes.
            `,
            exercise: "Draft an HTTP server health check response page route in Node.js that returns status 200 and a 'healthy' string JSON if dependencies are running."
          },
          {
            id: "cc-l-3-3",
            title: "Auto-Scaling & Elasticity",
            time: "50 min",
            summary: "Horizontal vs vertical scaling, auto-scaling groups, and target tracking scaling rules.",
            content: `
### Auto-Scaling & Elasticity

Elasticity is a core cloud feature, allowing resources to scale automatically as application demands shift.

#### Scaling Types:
*   **Vertical Scaling (Scale Up/Down):** Adding more CPU or RAM to an existing virtual server (e.g., resizing a \`t3.micro\` instance to a \`t3.large\`). Requires downtime.
*   **Horizontal Scaling (Scale Out/In):** Adding or removing server instances in a pool (e.g., scaling from 2 to 10 instances). Does not require downtime.

#### Auto-Scaling Groups (ASG):
ASGs automate horizontal scaling based on metrics:
*   **Minimum Size:** The minimum number of instances that must run.
*   **Desired Capacity:** The target number of instances.
*   **Maximum Size:** The upper limit of instances to control costs.
*   **Scaling Policies:**
    *   *Target Tracking:* Keeps average CPU usage at 50%.
    *   *Step Scaling:* Adds 3 instances if CPU utilization exceeds 80%.

#### Horizontal Scaling Flow:
\`\`\`
[Traffic Spike] ---> CPU Exceeds 70% ---> ASG launches new VM instance
                                                  |
[Traffic Drop]  <--- CPU Falls below 30% <--- ASG terminates instance
\`\`\`

#### Quiz Questions:
1. **What is vertical scaling?**
   *   a) Adding more server machines to a load balancer
   *   b) Upgrading a server's size (adding more CPU or RAM) (Correct)
   *   c) Moving resources to a different datacenter zone
2. **If your auto-scaling desired capacity is 3 and your maximum size is 10, how many instances will run by default?**
   *   a) 10 instances
   *   b) 3 instances (Correct)
   *   c) 7 instances

#### Interview Questions:
* **How does elasticity differ from scalability?**
  *   *Answer:* Scalability is the ability of a system to handle increased load by adding resources. Elasticity is the ability to scale resources up *and* down dynamically in response to real-time workload fluctuations, preventing over-provisioning.
* **What is the purpose of a cooldown period in an Auto-Scaling Group?**
  *   *Answer:* The cooldown period stops the ASG from launching or terminating additional instances immediately after a scaling event. It gives the newly launched instances time to boot up and start handling traffic, preventing rapid, wasteful scaling changes.

#### Summary:
Vertical scaling resizes host servers, while horizontal scaling dynamically adds nodes. Auto-scaling groups use metrics like CPU load to scale instances up and down.
            `,
            exercise: "Design an auto-scaling policy that scales out when CPU usage exceeds 75% for 5 minutes, and scales in when usage falls below 25%."
          },
          {
            id: "cc-l-3-4",
            title: "Disaster Recovery & High Availability",
            time: "55 min",
            summary: "RTO and RPO metrics, active-active vs active-passive configurations, and multi-region failover.",
            content: `
### Disaster Recovery & High Availability

High Availability (HA) keeps applications running during hardware failures within a region. Disaster Recovery (DR) recovers systems after catastrophic outages that take out entire regions or datacenters.

#### Key Recovery Metrics:
1.  **RTO (Recovery Time Objective):** The maximum tolerable downtime before systems must be restored (measured in minutes/hours).
2.  **RPO (Recovery Point Objective):** The maximum tolerable data loss, measured by time (e.g., an RPO of 4 hours means backups are taken every 4 hours; any data written since the last backup is lost).

#### Disaster Recovery Strategies:
*   **Backup & Restore:** Simple, cheap. Back up data regularly to S3. Slow recovery times (High RTO).
*   **Pilot Light:** Core databases are replicated actively. App servers are configured but kept off or minimized until a disaster occurs.
*   **Warm Standby:** A scaled-down version of the application runs in a secondary region. Quick failover times.
*   **Active-Active Multi-Region:** The application runs at full capacity in two regions simultaneously. Traffic is routed using latency DNS. Zero downtime (Near-zero RTO/RPO) but highly complex and expensive.

#### Quiz Questions:
1. **What does a Recovery Point Objective (RPO) of 1 hour mean?**
   *   a) The system must be restored in 1 hour
   *   b) No more than 1 hour worth of data can be lost in a disaster (Correct)
   *   c) The backup server takes 1 hour to boot
2. **Which DR strategy offers the lowest RTO and RPO but costs the most?**
   *   a) Backup & Restore
   *   b) Warm Standby
   *   c) Active-Active Multi-Region (Correct)

#### Interview Questions:
* **Explain the difference between High Availability (HA) and Fault Tolerance.**
  *   *Answer:* High Availability minimizes downtime using load balancing and auto-scaling, but minor disruptions can still occur during failover events. Fault tolerance guarantees zero downtime by using redundant hardware running in parallel (active-active), ensuring no service degradation.
* **How do you calculate RTO for a cloud system?**
  *   *Answer:* RTO is the duration from the moment of disaster onset to the moment the service becomes fully available to users again. It is determined by the speed of failovers, server boot times, and data restoration scripts.

#### Summary:
RTO measures restoration speed, and RPO measures tolerable data loss. DR strategies scale from cheap backups to expensive active-active multi-region deployments.
            `,
            exercise: "Draw a chart comparing Backup & Restore, Pilot Light, Warm Standby, and Active-Active against cost and RTO/RPO limits."
          },
          {
            id: "cc-l-3-5",
            title: "Cloud Monitoring & Logging",
            time: "45 min",
            summary: "Metric collections, log aggregation, CloudWatch dashboards, and configuring alerts.",
            content: `
### Cloud Monitoring & Logging

To keep systems running smoothly, you need visibility into CPU usage, memory allocation, network latency, and application errors.

#### Core Monitoring Components (AWS CloudWatch):
1.  **Metrics:** Time-series data points describing performance (e.g., \`CPUUtilization\`, \`DiskReadBytes\`, \`HealthyHostCount\`).
2.  **Logs:** Standard text records generated by operating systems or applications (e.g., Nginx access logs, Node.js console output). Logs are sent to a centralized location (Log Groups) for auditing.
3.  **Alarms:** Watches metrics and triggers notifications (e.g., via email using SNS) or executes auto-scaling actions if a threshold is breached (e.g., CPU > 80% for 3 cycles).

#### Real-World Example:
If Nginx web server logs indicate an unusual spike in HTTP 500 error codes, a CloudWatch log filter counts the matches. If the rate exceeds 10 per minute, an alarm triggers, sending an SMS alert to the engineering team and updating the team's dashboard.

#### Quiz Questions:
1. **Which component is used to monitor metrics and trigger notifications if a threshold is exceeded?**
   *   a) Log Stream
   *   b) Alarm (Correct)
   *   c) Dashboard
2. **What type of data is CPUUtilization?**
   *   a) Text log entry
   *   b) Time-series metric (Correct)
   *   c) IAM permission policy

#### Interview Questions:
* **What is the difference between CPU monitoring and memory monitoring on basic EC2 instances?**
  *   *Answer:* CPU, disk, and network metrics are hypervisor-visible and collected by default. Memory usage is internal to the operating system; monitoring it requires installing a monitoring agent on the instance to push custom memory metrics to the console.
* **Why is centralizing application logs critical in auto-scaled server environments?**
  *   *Answer:* In auto-scaled environments, instances are created and terminated dynamically. If an instance experiences an error and is terminated by the Auto-Scaling Group, its local logs are deleted. Centralized logging preserves these logs for post-mortem debugging.

#### Summary:
Cloud monitoring uses time-series metrics to track health and log groups to audit application outputs. Alarms notify teams of server issues automatically.
            `,
            exercise: "Draft an alarm configuration specifying the metric, threshold, evaluate window, and notification target for database storage warnings."
          }
        ]
      },
      {
        id: "cc-m-4",
        title: "Module 4: Cloud DevOps, Serverless & Microservices",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Explain microservices container deployment in ECS or EKS",
          "Develop serverless compute logic using AWS Lambda",
          "Write Terraform configurations to deploy resources using code",
          "Optimize cloud budgets and control operational costs"
        ],
        lessons: [
          {
            id: "cc-l-4-1",
            title: "Microservices & Containers in the Cloud",
            time: "55 min",
            summary: "Containerization, ECS clusters, Kubernetes EKS, and service discovery routing.",
            content: `
### Microservices & Containers in the Cloud

Deploying monolithic software applications limits scalability. Modern cloud architectures run **Microservices** packaged inside lightweight **Containers**.

#### Container Orchestration:
Containers (packaged via Docker) isolate runtimes. To manage thousands of containers, developers use orchestrators:
1.  **Amazon ECS (Elastic Container Service):** A highly integrated, easy-to-use container orchestrator native to AWS.
2.  **Amazon EKS (Elastic Kubernetes Service):** Managed Kubernetes, ideal for complex, multi-cloud container management.
3.  **AWS Fargate:** A serverless compute engine for containers. You run containers directly without managing the underlying EC2 host instances.

#### Monolithic vs. Microservices Architecture:
\`\`\`
Monolith (Single App)              Microservices (Decoupled)
+------------------------+         +-------+   +-------+   +-------+
| UI, Auth, DB, Billing  |         | WebUI |-->| Auth  |-->| Billing
| running on one server  |         +-------+   +-------+   +-------+
+------------------------+                         v           v
                                               [DB Pod]    [Cache]
\`\`\`

#### Quiz Questions:
1. **Which service allows you to run Docker containers in a serverless environment without managing EC2 host instances?**
   *   a) AWS EC2
   *   b) AWS Fargate (Correct)
   *   c) AWS S3
2. **What is Kubernetes?**
   *   a) A database query language
   *   b) An open-source container orchestration engine (Correct)
   *   c) An operating system image

#### Interview Questions:
* **Why are containers preferred over full virtual machines for deploying microservices?**
  *   *Answer:* Virtual machines include a full guest operating system, which requires gigabytes of space and takes minutes to boot. Containers share the host kernel and only pack application code and dependencies, booting in seconds and using megabytes of memory.
* **Explain the concept of Service Discovery in microservices.**
  *   *Answer:* In microservices, containers boot up and shut down dynamically, changing their IP addresses. Service discovery tools (like AWS Cloud Map or Kubernetes CoreDNS) maintain a registry of active services, allowing containers to locate and communicate with each other dynamically.

#### Summary:
Microservices split apps into decoupled systems. Docker packages these services into containers, and ECS/EKS orchestrate deployment and scaling.
            `,
            exercise: "Write a simple Dockerfile that compiles a Node.js express server, exposes port 8080, and runs the launch command."
          },
          {
            id: "cc-l-4-2",
            title: "Serverless Compute (AWS Lambda)",
            time: "50 min",
            summary: "Serverless execution models, event-driven functions, cold starts, and cost metrics.",
            content: `
### Serverless Compute (AWS Lambda)

Serverless compute allows you to run application code without provisioning or managing physical or virtual servers. You pay only for the compute time you consume down to the millisecond.

#### Core Serverless Concepts:
*   **Event-Driven:** Functions execute in response to events (e.g., a file uploaded to S3, an API gateway call, a database record update).
*   **Ephemeral:** The function container boots up, executes code, and shuts down immediately.
*   **Cold Start:** The latency delay that occurs when a function is called for the first time in a while. The cloud provider must spin up a new micro-VM container container, load the runtime, and initialize the code.

#### AWS Lambda Node.js Handler Example:
\`\`\`javascript
// index.handler.js
exports.handler = async (event) => {
    console.log("Event received:", JSON.stringify(event, null, 2));
    
    // Extract parameters from HTTP call:
    const username = event.queryStringParameters?.name || "Guest";
    
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: \`Hello, \${username}! Welcome to serverless.\`,
            timestamp: new Date()
        })
    };
    return response;
};
\`\`\`

#### Quiz Questions:
1. **What triggers execution of a serverless function?**
   *   a) A timer scheduler or event trigger (Correct)
   *   b) A database partition change
   *   c) A physical server reboot
2. **What is a cold start in serverless computing?**
   *   a) An error code returned when servers fail
   *   b) The latency delay when a function container is initialized for the first time (Correct)
   *   c) Running code in a cold region

#### Interview Questions:
* **How are serverless functions billed?**
  *   *Answer:* Billing is calculated based on two metrics: the number of requests (invocations) and the duration of code execution, measured in Gigabyte-seconds (RAM size allocated multiplied by execution time in milliseconds).
* **Describe how to mitigate cold start issues in latency-sensitive APIs.**
  *   *Answer:* You can use Provisioned Concurrency, which keeps a set number of containers pre-warmed. Other methods include minimizing import packages, keeping code lightweight, or choosing runtimes with faster cold start times (like JavaScript or Go over Java).

#### Summary:
Serverless functions are event-driven, ephemeral compute scripts that auto-scale. You pay only for execution time. Cold starts are minimized by optimization.
            `,
            exercise: "Write an AWS Lambda function in Python that parses an S3 trigger event and prints the uploaded file's key to logs."
          },
          {
            id: "cc-l-4-3",
            title: "Infrastructure as Code (IaC)",
            time: "55 min",
            summary: "Declarative resource provisioning, Terraform configurations, state files, and execution plans.",
            content: `
### Infrastructure as Code (IaC)

Manually creating resources in a cloud dashboard is error-prone, hard to audit, and cannot be replicated easily. **Infrastructure as Code (IaC)** allows you to define your entire cloud architecture in configuration files.

#### Core IaC Concepts:
*   **Declarative vs. Imperative:** Declarative tools (like Terraform or CloudFormation) allow you to specify *what* you want (the desired state); the tool determines *how* to build it. Imperative tools require you to specify step-by-step commands.
*   **State File:** A file (e.g., \`terraform.tfstate\`) that acts as a database mapping your configuration files to real-world cloud resources.
*   **Execution Plan:** A preview of changes the tool will make (create, modify, or destroy) before applying them.

#### Terraform Configuration Example:
This file provisions an S3 bucket:
\`\`\`hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "my_assets_bucket" {
  bucket = "synapse-academy-unique-assets-bucket"
  
  tags = {
    Environment = "Dev"
    Project     = "Academy"
  }
}
\`\`\`

#### Quiz Questions:
1. **Which file is used by Terraform to track configured resources mapped to actual deployed cloud assets?**
   *   a) main.tf
   *   b) tfstate file (Correct)
   *   c) variables.tf
2. **What does 'terraform apply' do?**
   *   a) Deletes configuration files
   *   b) Executes the changes to match the configuration state (Correct)
   *   c) Installs compiler binaries

#### Interview Questions:
* **Why is it critical to secure the Terraform state file?**
  *   *Answer:* The state file contains a complete mapping of your infrastructure, including private IP addresses and potentially sensitive passwords or access tokens in plaintext. If lost or compromised, managing the infrastructure becomes difficult.
* **Explain the difference between mutable and immutable infrastructure.**
  *   *Answer:* Mutable infrastructure is updated in-place (e.g., SSH-ing into a server and installing updates). Immutable infrastructure replaces instances completely (e.g., using Terraform to terminate the old server and launch a fresh, updated server instance).

#### Summary:
IaC allows managing infrastructure using code files. Terraform uses declarative configurations and state files to plan and apply changes repeatably.
            `,
            exercise: "Write a Terraform resource block to provision a t3.micro EC2 instance running Ubuntu in the us-east-1 region."
          },
          {
            id: "cc-l-4-4",
            title: "Content Delivery Networks (CDN)",
            time: "50 min",
            summary: "Edge caching, CDN origins, TTL configurations, and securing endpoints.",
            content: `
### Content Delivery Networks (CDN)

CDNs optimize file delivery speeds globally. They store copies of static assets (images, CSS, JS, HTML) at edge datacenters closer to users.

#### Core CDN Concepts:
*   **Origin:** The primary source of truth folder or server where the original files are hosted (e.g., an S3 bucket or EC2 server).
*   **Edge Cache:** Caching servers close to users. When a user requests a file, the CDN check if it's cached locally:
    *   *Cache Hit:* The file is returned immediately from the edge server.
    *   *Cache Miss:* The edge server fetches the file from the origin, caches it, and returns it to the user.
*   **TTL (Time to Live):** The duration a file remains cached at the edge before it is considered stale and must be fetched again from the origin.

#### CDN Caching Workflow:
\`\`\`
[User in London] ===> Request /logo.png ===> [Edge Server (London)] -- Cache Hit --> Return file (10ms)
                                                     |
                                                 Cache Miss
                                                     v
                                            [Origin S3 in Tokyo] (300ms latency)
\`\`\`

#### Quiz Questions:
1. **What occurs during a CDN cache miss?**
   *   a) The user receives an error code
   *   b) The edge server fetches the asset from the origin, caches it, and returns it to the user (Correct)
   *   c) The network reboots
2. **Which parameter controls how long an asset remains cached at an edge server?**
   *   a) DNS record type
   *   b) CIDR block
   *   c) Time to Live (TTL) (Correct)

#### Interview Questions:
* **How do you invalidate a cached file on a CDN before its TTL expires?**
  *   *Answer:* You trigger a cache invalidation request specifying the file path (e.g., \`/*\` or \`/index.html\`). This forces all edge servers to purge their cached copies and fetch fresh files from the origin on the next request.
* **Why would a CDN be used for dynamic content API routing?**
  *   *Answer:* CDNs like CloudFront optimize dynamic routing by keeping open connections to the origin server along the cloud provider's high-speed global private network, bypassing public internet routing bottlenecks.

#### Summary:
CDNs use global edge caching to minimize latency. Cache hits serve files quickly, and TTL limits control cache freshness.
            `,
            exercise: "Configure a CDN caching rule that sets static image assets to a TTL of 1 year, and API response JSON paths to a TTL of 0 seconds."
          },
          {
            id: "cc-l-4-5",
            title: "Cloud Billing, Cost Optimization & FinOps",
            time: "45 min",
            summary: "Monitoring cloud costs, cost allocation tags, right-sizing resources, and FinOps budgeting practices.",
            content: `
### Cloud Billing & Cost Optimization

While cloud platforms make scaling easy, unmonitored compute resources can lead to unexpectedly high monthly bills. Cost optimization is a continuous operational requirement.

#### Cost Management Best Practices:
1.  **Right-Sizing:** Continuously analyze server configurations and downsize underutilized instances (e.g. if a database host runs at 5% CPU capacity, downgrade it to a smaller instance type).
2.  **Tagging Policies:** Attach cost allocation tags (e.g., \`Project=Marketing\`, \`Environment=Prod\`) to resources. This allows accounting teams to audit exactly which projects generate billing costs.
3.  **Idle Resource Deletion:** Identify and clean up orphaned block storage volumes (unattached EBS disks), idle load balancers, or forgotten test instances.
4.  **Budgets and Alerts:** Set up automated billing budgets. If the month's projected costs exceed the budget, the system sends email notifications to prevent bill shock.

#### Quiz Questions:
1. **What is right-sizing in cloud cost management?**
   *   a) Allocating more IP addresses
   *   b) Resizing server resource capacities to match actual application load demands (Correct)
   *   c) Relocating databases to different countries
2. **Which tool is used to monitor cloud budgets and trigger email alerts?**
   *   a) CloudWatch Logs
   *   b) AWS Budgets / Cost Explorer (Correct)
   *   c) Identity Access Management

#### Interview Questions:
* **What is an orphan volume in cloud storage, and how does it affect billing?**
  *   *Answer:* An orphan volume is a block storage drive (like EBS) that remains active and billed after its virtual machine host has been terminated. Providers charge for provisioned storage space regardless of whether it is mounted, resulting in wasted costs.
* **Describe how FinOps bridges the gap between engineering and finance teams.**
  *   *Answer:* FinOps introduces cost responsibility to developers. It combines financial management with cloud engineering, ensuring that teams use cost allocation tags and optimization dashboards to build cost-efficient architectures.

#### Summary:
Cloud optimization requires right-sizing servers, deleting idle storage volumes, and tracking budgets. Cost allocation tags allow accounting audits.
            `,
            exercise: "Review a mock cloud invoice and identify the three most expensive resources, suggesting cost-saving actions for each (e.g. converting instances to Spot)."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "Cloud Provider Manuals",
    items: [
      { name: "AWS General Documentation", desc: "Detailed user guides and SDK references for all services.", link: "https://docs.aws.amazon.com" },
      { name: "Google Cloud Guides Portal", desc: "Configuration tutorials for GCP databases, compute, and serverless.", link: "https://cloud.google.com/docs" },
      { name: "Terraform HCL Documentation", desc: "Guides and resource schemas for writing Infrastructure as Code.", link: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs" }
    ]
  }
];

export const glossary = [
  { term: "Cloud Computing", def: "The on-demand delivery of compute, database, and storage resources via the internet with pay-as-you-go pricing." },
  { term: "IaaS", def: "Infrastructure as a Service - renting raw computing hardware like virtual servers and network firewalls." },
  { term: "PaaS", def: "Platform as a Service - managed runtime platform where developers deploy code files directly." },
  { term: "SaaS", def: "Software as a Service - complete end-user software applications accessed online." },
  { term: "Hypervisor", def: "Software layer managing virtual machines on top of bare-metal hardware or host OS systems." },
  { term: "VPC", def: "Virtual Private Cloud - an isolated private network segment dedicated to your cloud account." },
  { term: "Security Group", def: "A stateful instance-level virtual firewall controlling traffic to server VMs." },
  { term: "Object Storage", def: "Highly scalable unstructured storage organizing files as flat key-value items in buckets." },
  { term: "RTO / RPO", def: "Recovery Time Objective (restoration downtime limits) and Recovery Point Objective (allowable database data loss limits)." },
  { term: "Serverless", def: "An event-driven execution model where the cloud provider manages server scaling and charges based on resource execution time." }
];
