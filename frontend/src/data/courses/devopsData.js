// DevOps & CI/CD Complete Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "do-phase-1",
    title: "Phase 1: Linux CLI, Git Workflows, and Containerization (Weeks 1–2)",
    description: "Learn Linux terminal management, multi-branch Git flows, Docker containerization, and Kubernetes configuration patterns.",
    modules: [
      {
        id: "do-m-1",
        title: "Module 1: Linux Administration & Version Control",
        duration: "1 Week",
        difficulty: "Beginner-Intermediate",
        objectives: [
          "Navigate the Linux CLI and modify permissions using chmod",
          "Automate system maintenance tasks using Bash scripts",
          "Manage Git repositories, resolve merge conflicts, and rebase trees"
        ],
        lessons: [
          {
            id: "do-l-1-1",
            title: "Linux CLI Basics & File System Navigation",
            time: "45 min",
            summary: "Command line inputs, directory structures, standard streams, pipe redirects, and auditing file listings.",
            content: `
### Linux CLI Basics & File System Navigation

Linux is the operating system powering over 90% of the world's production servers. DevOps engineers must navigate, manage, and configure files directly from command-line interfaces (CLI).

#### Core Concepts:
* **The Shell:** A command interpreter layer wrapping the OS kernel (e.g., Bash, Zsh).
* **The Root Directory (\`/\`):** The absolute peak of the file system hierarchy.
* **Standard Streams:**
  * \`stdin\` (0): Keyboard input stream.
  * \`stdout\` (1): Normal console outputs stream.
  * \`stderr\` (2): Errors console outputs stream.
* **Redirection Operators:**
  * \`>\`: Redirects output to a file (overwriting it).
  * \`>>\`: Appends output to a file.
  * \`|\` (Pipe): Passes the output of one command as the input to the next command.

#### Linux Command Examples:
\`\`\`bash
# 1. Show current working directory path
pwd

# 2. List all files (including hidden files) with sizes and times
ls -la

# 3. Find error logs in system logs using pipes
cat /var/log/syslog | grep "ERROR" | tail -n 10
\`\`\`

#### Quiz Questions:
1. **Which stream redirection operator is used to append output to an existing file without deleting its current contents?**
   *   a) \`>\`
   *   b) \`>>\` (Correct)
   *   c) \`|\`
2. **What does the 'ls -a' flag do?**
   *   a) Lists files including hidden files starting with a dot (Correct)
   *   b) Analyzes CPU loads
   *   c) Deletes folders

#### Interview Questions:
* **Explain how a pipe (|) works in a Linux terminal.**
  *   *Answer:* A pipe redirects the standard output (\`stdout\`) of the preceding command into the standard input (\`stdin\`) of the following command, allowing chains of commands to filter and process text.
* **What is the difference between an absolute path and a relative path?**
  *   *Answer:* An absolute path specifies a location starting from the root directory (\`/\`, e.g., \`/var/www/html\`). A relative path specifies a location relative to the current directory (e.g., \`../html\`).

#### Summary:
DevOps relies on the Linux CLI. Navigate directories using standard commands, redirect streams using \`>\` and \`>>\`, and pipe commands to parse logs.
            `,
            exercise: "Write a command chain that finds all lines containing '404' in an access.log file, counts the matching lines, and writes the sum to errors.txt."
          },
          {
            id: "do-l-1-2",
            title: "File Permissions & Users Management",
            time: "40 min",
            summary: "Read-write-execute permissions, chmod numeric/symbolic notation, and ownership modifications using chown.",
            content: `
### File Permissions & Users Management

Linux enforces a multi-user permission model, protecting resources and blocking unauthorized file edits.

#### Permission Triplets:
Every file and folder is mapped to three groups:
1. **User (Owner):** The user account who created the file.
2. **Group:** A collection of users associated with the file.
3. **Others:** Everyone else on the server.

#### Numerical Notation:
Permissions are represented as Read (4), Write (2), and Execute (1):
* **4 (r--)**: Read only.
* **6 (rw-)**: Read and write (4 + 2).
* **7 (rwx)**: Read, write, and execute (4 + 2 + 1).
* A file with permission \`755\` grants \`rwx\` to User (7), \`r-x\` to Group (5), and \`r-x\` to Others (5).

#### Command Examples:
\`\`\`bash
# 1. Change file permission to rwxr-xr-x
chmod 755 run_script.sh

# 2. Change file owner to 'nginx' and group to 'www-data'
chown nginx:www-data config.json
\`\`\`

#### Quiz Questions:
1. **Which octal number combination grants read-write access to the owner, but read-only access to group and others?**
   *   a) 755
   *   b) 644 (Correct)
   *   c) 777
2. **What does the command 'chown -R www-data:www-data /var/www' do?**
   *   a) Deletes /var/www folder
   *   b) Recursively changes ownership of all files inside /var/www to the www-data user and group (Correct)
   *   c) Restarts web services

#### Interview Questions:
* **What is execute permission on a directory versus a file?**
  *   *Answer:* On a file, execute permission allows it to be run as a program. On a directory, execute permission allows a user to enter (cd) the directory and access metadata.
* **Explain the security risk of configuring file permissions to 777.**
  *   *Answer:* Permissions of \`777\` grant read, write, and execute rights to everyone on the system. If an attacker compromises a low-privilege service, they can read or modify these files, resulting in local privilege escalation.

#### Summary:
Permissions map to Owner, Group, and Others. Use numeric codes (Read=4, Write=2, Execute=1) with \`chmod\` to set permissions and \`chown\` to change owners.
            `,
            exercise: "Create a mock file, change its permissions to read-only for group and others, and write-execute for the owner."
          },
          {
            id: "do-l-1-3",
            title: "Bash Shell Scripting & Automation",
            time: "45 min",
            summary: "Writing Bash scripts, variables, loop syntax, conditional gates, and return exit codes.",
            content: `
### Bash Shell Scripting & Automation

Scripting enables automated environment setups, log rotations, backups, and deployments.

#### Core Components:
* **The Shebang (\`#!/bin/bash\`):** The first line of a script indicating which interpreter should run the file.
* **Exit Codes:** Every script returns a code (0 indicating success; 1-255 indicating errors).
* **Conditionals:** If/Else blocks evaluating file status or string equality.

#### Bash Script Code Example:
\`\`\`bash
#!/bin/bash

# Define variables
LOG_DIR="/var/log/app"
BACKUP_DIR="/tmp/backup"

# Conditional: Check if directory exists
if [ -d "$LOG_DIR" ]; then
    echo "Directory exists. Copying logs..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$LOG_DIR"/*.log "$BACKUP_DIR"
    exit 0
else
    echo "ERROR: Log directory not found!" >&2
    exit 1
fi
\`\`\`

#### Quiz Questions:
1. **What must be the very first line of a Bash script to execute it correctly?**
   *   a) \`# This is a comment\`
   *   b) \`#!/bin/bash\` (Shebang) (Correct)
   *   c) \`exit 0\`
2. **What does an exit code of 0 represent in shell execution?**
   *   a) General error
   *   b) Successful execution (Correct)
   *   c) Missing command arguments

#### Interview Questions:
* **How do you pass command-line arguments to a Bash script?**
  *   *Answer:* Positional parameters are assigned inside the script based on argument index: \`$1\` represents the first argument, \`$2\` the second, and \`$@\` represents the list of all arguments.
* **What is the difference between double brackets [[ ]] and single brackets [ ] in Bash?**
  *   *Answer:* Double brackets \`[[ ]]\` represent an advanced test command supported by Bash, offering regex matching, logical operators (\`&&\`, \`||\`), and preventing word splitting errors.

#### Summary:
Shell scripting automates CLI procedures. Start with a shebang, handle parameters using indices, and return exit codes (0 for success) to direct pipelines.
            `,
            exercise: "Write a Bash script that loops through files in the current folder and prints a message for every file ending in '.sh'."
          },
          {
            id: "do-l-1-4",
            title: "Git Core: Commits, Logs, and Tree Objects",
            time: "45 min",
            summary: "Git tracking zones, staging, commit hashes, reflogs, and commit histories audit.",
            content: `
### Git Core: Commits, Logs, and Tree Objects

Git is a distributed version control system. Understanding Git's data structure helps resolve conflicts and manage code changes.

#### The Three Git Zones:
1. **Working Directory:** Files currently modified on disk.
2. **Staging Area (Index):** A snapshot file mapping changes ready for the next commit.
3. **Git Directory (Repository):** Database storing commit history, trees, and blobs.

#### Core CLI Commands:
\`\`\`bash
# 1. Stage modified files
git add config.yaml

# 2. Record staged changes with message
git commit -m "feat: Add production database configs"

# 3. View commit history tree
git log --oneline --graph
\`\`\`

#### Quiz Questions:
1. **Which Git area holds files that have been modified but are not yet staged for a commit?**
   *   a) Staging Area
   *   b) Working Directory (Correct)
   *   c) .git folder
2. **What Git command is used to inspect all local HEAD movements, even after commits have been deleted or checked out?**
   *   a) git status
   *   b) git reflog (Correct)
   *   c) git reset

#### Interview Questions:
* **What is a Git commit under the hood?**
  *   *Answer:* A commit is a JSON-like object pointing to a tree object (directory snapshot), containing metadata (author, committer, date, message) and parent commit hashes.
* **Explain how git reflog differs from git log.**
  *   *Answer:* \`git log\` displays the public commit history of the current branch. \`git reflog\` lists private local history of HEAD updates, tracking every branch checkout, commit, reset, or rebase, allowing you to restore deleted code.

#### Summary:
Git files move from Working Directory to Staging, then to Repository. Commits are snapshots linked by hashes. Reflog tracks local HEAD movements.
            `,
            exercise: "Initialize a local git repository, commit a file, modify it, stage changes, and view the staging area diff output."
          },
          {
            id: "do-l-1-5",
            title: "Git Branching, Merges & Rebase Workflows",
            time: "50 min",
            summary: "Branch pointers, fast-forward merges, three-way merges, resolving merge conflicts, and interactive rebasing.",
            content: `
### Git Branching, Merges & Rebase Workflows

Branches allow developers to work on features in parallel without affecting the stable production branch.

#### Merge vs. Rebase:
* **git merge:** Integrates a feature branch into the target branch, creating a **merge commit**. Preserves complete history but can result in cluttered history graphs.
* **git rebase:** Re-applies commits on top of another base tip, creating a **linear commit history**. Avoid rebasing public shared branches.

#### Branching Workflows:
\`\`\`bash
# 1. Create and switch to new branch
git checkout -b feature/auth

# 2. Rebase feature branch on top of main branch
git checkout feature/auth
git rebase main

# 3. Resolve merge conflict: edit files, then run:
git add resolved_file.txt
git rebase --continue
\`\`\`

#### Quiz Questions:
1. **Why should you avoid rebasing branch commits that have been pushed to public shared repositories?**
   *   a) Rebase changes commit hashes, rewriting public history and breaking pulls for other developers (Correct)
   *   b) Rebase deletes branches
   *   c) Rebase compiles files
2. **What type of merge occurs if the target branch has not changed since the feature branch was branched?**
   *   a) Three-way Merge
   *   b) Fast-Forward Merge (Correct)
   *   c) Rebase Merge

#### Interview Questions:
* **How do you resolve a Git merge conflict?**
  *   *Answer:* Open the conflicting files to find Git's conflict markers (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`). Edit the files to choose which changes to keep, delete the markers, stage the files with \`git add\`, and complete the merge with \`git commit\`.
* **What is the difference between git reset and git revert?**
  *   *Answer:* \`git reset\` moves branch pointers backward, modifying commit history (unsafe on shared branches). \`git revert\` creates a new commit that applies inverse changes to undo a past commit, keeping history clean.

#### Summary:
Use merges to preserve branch context or rebases to create linear commit histories. Resolve conflicts by editing code markers.
            `,
            exercise: "Create two local branches that edit the same line of a file. Merge them, locate the conflict markers, resolve them, and commit."
          }
        ]
      },
      {
        id: "do-m-2",
        title: "Module 2: Containerization & Orchestration",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Explain Docker containerization vs virtualization architectures",
          "Write optimized multi-stage Dockerfiles",
          "Configure network drivers and mount volumes",
          "Orchestrate multi-service stacks using Docker Compose",
          "Write Kubernetes manifests defining Pods and Deployments"
        ],
        lessons: [
          {
            id: "do-l-2-1",
            title: "Docker Basics: Containers vs Virtual Machines",
            time: "45 min",
            summary: "Kernel namespace isolations, cgroups resource controls, and comparing hypervisors to runtime engines.",
            content: `
### Containers vs. Virtual Machines

Docker package code and dependencies together, eliminating the "works on my machine" problem.

#### Key Architectural Differences:
1. **Virtual Machines (Hypervisors):**
   * Pack aged with a complete Guest OS, application, and dependencies.
   * Runs on hardware-managed Hypervisors.
   * Slow to boot (minutes) and heavy on resource usage.
2. **Containers (Docker Engine):**
   * Share the host system's OS kernel.
   * Isolates processes using Linux Kernel **namespaces** (PID, Net, Mnt) and **cgroups** (limiting CPU/Memory allocations).
   * Blazing fast boot times (seconds) and highly lightweight.

#### Comparison Visual:
\`\`\`
Virtual Machines:
[ App ] ===> [ Guest OS ] ===> [ Hypervisor ] ===> [ Host OS / Hardware ]

Containers:
[ App ] ===> [ Docker Engine ] ===> [ Host OS Kernel / Hardware ]
\`\`\`

#### Quiz Questions:
1. **What Linux kernel feature limits a container's CPU, memory, and network resources?**
   *   a) Namespaces
   *   b) Control Groups (cgroups) (Correct)
   *   c) Hypervisors
2. **Why are Docker containers lightweight compared to Virtual Machines?**
   *   a) They omit configuration files
   *   b) They share the host operating system kernel instead of booting complete guest OS systems (Correct)
   *   c) They run on cloud servers

#### Interview Questions:
* **How do namespaces provide isolation in Docker?**
  *   *Answer:* Namespaces wrap global system resources into isolated virtual views. PID namespaces hide other OS processes, Net namespaces isolate network adapters, and Mnt namespaces isolate file system mounts.
* **What is a union file system (UnionFS) in Docker?**
  *   *Answer:* UnionFS allows file changes to be layered dynamically. In Docker, images are built as read-only layers. When a container runs, Docker stacks a read-write layer on top, saving updates without duplicating base images.

#### Summary:
VMs boot complete guest operating systems. Containers share host kernels, leveraging namespaces for isolation and cgroups for resource limits.
            `,
            exercise: "Run an official Nginx container locally using Docker. Map host port 8080 to container port 80 and access it from a browser."
          },
          {
            id: "do-l-2-2",
            title: "Writing Dockerfiles & Image Multi-Stage Builds",
            time: "50 min",
            summary: "Docker base images, caching layers, CMD vs ENTRYPOINT, and optimizing image size with multi-stage builds.",
            content: `
### Dockerfiles & Image Multi-Stage Builds

A Dockerfile contains instructions to build a Docker image. Minimizing image sizes reduces vulnerabilities and download speeds.

#### Multi-Stage Builds:
A technique that uses multiple \`FROM\` instructions in a single Dockerfile. You build the application in an early builder stage, then copy only compile outputs into a tiny runtime base image, discarding heavy build tools.

#### Multi-Stage Dockerfile Example (Node.js):
\`\`\`dockerfile
# Stage 1: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create tiny production runtime
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

#### Quiz Questions:
1. **In a Dockerfile, what is the key difference between CMD and ENTRYPOINT?**
   *   a) CMD defines build tools, ENTRYPOINT defines runtime ports
   *   b) ENTRYPOINT defines the core executable, while CMD provides default arguments that can be overridden at runtime (Correct)
   *   c) They are identical
2. **How does a multi-stage Docker build reduce final production image size?**
   *   a) By compressing files into ZIP archives
   *   b) By throwing away intermediate build tools and SDK files, copying only compiled outputs to the final stage (Correct)
   *   c) By removing environment variables

#### Interview Questions:
* **Why should you order Dockerfile lines from least-changing to most-changing?**
  *   *Answer:* Docker caches build stages. If a layer changes (e.g. copying source files), all subsequent layers are invalidated and must rebuild. Placing static actions (like installing dependencies) before changing code checks optimizes build cache speeds.
* **What is the difference between COPY and ADD in a Dockerfile?**
  *   *Answer:* \`COPY\` is simple and copies local files into containers. \`ADD\` does the same but supports remote URLs and automatically extracts local tar archives into the target directories. Use \`COPY\` for standard operations.

#### Summary:
Use multi-stage builds to discard heavy build dependencies. Order Dockerfile lines strategically to leverage layer caching. Use ENTRYPOINT for core run commands.
            `,
            exercise: "Draft a Dockerfile for a Python application that installs requirements.txt, sets ENV variables, and runs app.py."
          },
          {
            id: "do-l-2-3",
            title: "Docker Volumes, Networking & Ports",
            time: "50 min",
            summary: "Data persistence, bind mounts, bridge/host/none network drivers, and publishing port forwards.",
            content: `
### Docker Volumes, Networking & Ports

By default, data in containers is ephemeral. Containers also run in isolated sandbox networks.

#### 1. Data Persistence:
* **Bind Mounts:** Maps a directory on the host directly into a container (useful for local development code hot reloading).
* **Named Volumes:** Managed by Docker on the host filesystem. Best for databases, ensuring data persists when containers are deleted.

#### 2. Network Drivers:
* **Bridge (Default):** Creates an isolated virtual network bridge. Containers on the same bridge can communicate using IP addresses or container names.
* **Host:** Bypasses Docker's network virtualization, binding container ports directly to the host's IP address.
* **None:** Disables container networking entirely.

#### Command Examples:
\`\`\`bash
# 1. Create a persistent named volume
docker volume create db_data

# 2. Run database container mounting the volume and publishing ports
docker run -d -p 5432:5432 -v db_data:/var/lib/postgresql/data postgres:16-alpine
\`\`\`

#### Quiz Questions:
1. **Which Docker network driver maps container ports directly to the host's interface without virtualization?**
   *   a) Bridge
   *   b) Host (Correct)
   *   c) Overlay
2. **What occurs to data stored inside a named volume when the container using it is stopped and deleted?**
   *   a) The volume data is deleted immediately
   *   b) The volume data persists on the host machine and can be mounted to a new container (Correct)
   *   c) The host system crashes

#### Interview Questions:
* **What is the difference between mounting a volume (-v) and a bind mount?**
  *   *Answer:* A volume is managed by Docker in a dedicated directory on the host (e.g., \`/var/lib/docker/volumes\`). A bind mount maps an arbitrary folder path on the host machine directly to a container target, making it host-dependent.
* **Explain how Docker's internal DNS works inside bridge networks.**
  *   *Answer:* Docker provides an embedded DNS server. When containers are attached to a user-defined bridge network, they can look up and connect to other containers using their container name rather than dynamic IP addresses.

#### Summary:
Use named volumes to persist databases. Bridge networks provide isolated communication zones, and mapping ports targets external access.
            `,
            exercise: "Create a user-defined bridge network, run two containers on it, and verify they can ping each other using their container names."
          },
          {
            id: "do-l-2-4",
            title: "Docker Compose Multi-Service Stacks",
            time: "50 min",
            summary: "YAML config parameters, multi-container layouts, environment inputs, and dependency check sequences.",
            content: `
### Docker Compose Multi-Service Stacks

Managing complex multi-tier apps with multiple \`docker run\` commands is tedious. Docker Compose uses YAML files to configure and run multi-container applications in a single command.

#### Docker Compose YAML Example:
\`\`\`yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app
      
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass

volumes:
  pgdata:
\`\`\`

#### Control Commands:
\`\`\`bash
# 1. Start all container services in background (detached)
docker-compose up -d

# 2. Stop and remove containers, networks, and volumes
docker-compose down -v
\`\`\`

#### Quiz Questions:
1. **What command starts all services declared in a docker-compose.yml file in the background?**
   *   a) docker-compose run
   *   b) docker-compose up -d (Correct)
   *   c) docker-compose start
2. **What does the 'depends_on' key in a compose service declare?**
   *   a) Network port forwards
   *   b) Order of container startup dependencies (Correct)
   *   c) Storage paths

#### Interview Questions:
* **Does depends_on guarantee that the dependent service is ready to accept connections?**
  *   *Answer:* No. \`depends_on\` only guarantees that the target container has *started*. It doesn't check if the application inside (like a database) is fully initialized and listening on ports. To solve this, you need health checks or script wait-for scripts.
* **Explain how you share environment variables in Docker Compose.**
  *   *Answer:* You can declare variables directly in the \`environment\` key, read variables from a default \`.env\` file in the folder, or pass values from the host system shell directly.

#### Summary:
Docker Compose aggregates multi-container stacks in a single YAML file. Use \`up -d\` to spin them up and \`down\` to clean up.
            `,
            exercise: "Write a compose file defining an API service and a Redis cache database, linking them on a shared network."
          },
          {
            id: "do-l-2-5",
            title: "Kubernetes Core: Pods, Deployments & ReplicaSets",
            time: "55 min",
            summary: "Kubernetes control plane, worker node architecture, Pod structures, ReplicaSets, and writing basic YAML deployments.",
            content: `
### Kubernetes Core: Pods, Deployments & ReplicaSets

While Docker Compose runs containers on a single host, **Kubernetes** (K8s) orchestrates container scaling and scheduling across a cluster of multiple servers.

#### Control Plane vs. Worker Nodes:
* **Control Plane (Master Node):** Runs components like the API Server, Scheduler (selects where to run Pods), Controller Manager, and **etcd** (cluster state database).
* **Worker Nodes:** Run the containers. Key components are **Kubelet** (agent managing containers on the node) and **Kube-Proxy** (routes network traffic).

#### Core K8s Objects:
1. **Pod:** The smallest deployable unit in K8s, wrapping one or more containers sharing a network IP and ports.
2. **ReplicaSet:** Ensures a specified number of identical Pod replicas run at all times.
3. **Deployment:** Declarative schema controller that manages ReplicaSets, enabling zero-downtime updates.

#### Kubernetes Deployment Manifest:
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
\`\`\`

#### CLI Commands:
\`\`\`bash
# 1. Apply deployment manifest
kubectl apply -f deployment.yaml

# 2. Inspect running pods
kubectl get pods
\`\`\`

#### Quiz Questions:
1. **What is the smallest deployable computing unit in Kubernetes?**
   *   a) Container
   *   b) Pod (Correct)
   *   c) Node
2. **Which control plane component stores the complete cluster state and configuration?**
   *   a) Kube-Scheduler
   *   b) etcd (Correct)
   *   c) Kubelet

#### Interview Questions:
* **How does a Deployment update running pods without downtime?**
  *   *Answer:* It uses a rolling update strategy. It creates a new ReplicaSet, scales it up step-by-step, and scales down the old ReplicaSet in parallel, ensuring a set number of active pods remain available to accept traffic throughout the update.
* **What is the role of Kubelet on a worker node?**
  *   *Answer:* Kubelet is an agent running on each worker node that receives Pod manifests from the API Server and interacts with the container runtime (e.g. containerd) to start and monitor container health.

#### Summary:
Kubernetes clusters use a control plane to schedule workloads on worker nodes. Deployments wrap ReplicaSets, scaling Pod collections dynamically.
            `,
            exercise: "Deploy a mock app using kubectl, inspect its status, scale the deployment to 5 replicas, and verify the replica count change."
          }
        ]
      }
    ]
  },
  {
    id: "do-phase-2",
        title: "Phase 2: K8s Networking, CI/CD Automations, IaC, and Monitoring (Weeks 3–4)",
        description: "Configure Kubernetes ingress traffic, write YAML pipeline scripts, build Terraform templates, and monitor setups with Prometheus.",
        modules: [
          {
            id: "do-m-3",
            title: "Module 3: Kubernetes Networking & CI/CD Pipelines",
            duration: "1 Week",
            difficulty: "Advanced",
            objectives: [
              "Create ClusterIP, NodePort, and LoadBalancer Kubernetes Services",
              "Deploy Ingress routes directing traffic based on paths",
              "Synthesize GitHub Actions pipelines testing source commits",
              "Build declarative Jenkins pipeline scripts"
            ],
            lessons: [
              {
                id: "do-l-3-1",
                title: "Kubernetes Networking: Services & Ingress",
                time: "55 min",
                summary: "Exposing Pods, ClusterIP, NodePort, LoadBalancer configurations, and Ingress routing controllers.",
                content: `
### Kubernetes Networking: Services & Ingress

Pods in Kubernetes are ephemeral; their IP addresses change constantly when rescheduled. **Services** provide a stable network endpoint to route traffic to a dynamic group of Pods.

#### Service Types:
1. **ClusterIP (Default):** Exposes the Service on an internal cluster IP, making it accessible only within the cluster.
2. **NodePort:** Exposes the Service on a static port (30000-32767) on each Node's IP address. Routes external traffic to NodePort.
3. **LoadBalancer:** Provisions an external load balancer in cloud environments (like AWS or GCP), assigning a public IP routing traffic.

#### Ingress Controllers:
Exposes HTTP and HTTPS routes from outside the cluster to services inside the cluster, routing traffic based on path rules (e.g. \`/api\` vs \`/shop\`), acting as a reverse proxy.

#### K8s Service NodePort YAML:
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: NodePort
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
      nodePort: 32000
\`\`\`

#### Quiz Questions:
1. **Which Kubernetes Service type is only accessible internally within the cluster?**
   *   a) LoadBalancer
   *   b) NodePort
   *   c) ClusterIP (Correct)
2. **What resource acts as an HTTP reverse proxy, routing external web paths to specific internal K8s Services?**
   *   a) Kube-Proxy
   *   b) Ingress Controller (Correct)
   *   c) etcd

#### Interview Questions:
* **How does a Kubernetes Service know which Pods to route traffic to?**
  *   *Answer:* Services use **labels and selectors**. The service definition specifies a selector label (e.g. \`app: web\`). K8s continuously maps matching pods to an endpoints list, directing traffic to active instances.
* **Explain how Ingress differs from a LoadBalancer Service.**
  *   *Answer:* A LoadBalancer Service provisions a cloud-level load balancer per service, which is expensive. Ingress acts as a single entry point (reverse proxy) routing to dozens of internal services based on URLs and paths, saving resources.

#### Summary:
Services map stable access endpoints to dynamic Pod selections (ClusterIP, NodePort, LoadBalancer). Ingress acts as a path reverse proxy.
            `,
            exercise: "Write a Service manifest that exposes a deployment named 'api-backend' using NodePort on port 30500."
          },
          {
            id: "do-l-3-2",
            title: "Kubernetes Storage: PV, PVC & ConfigMaps",
            time: "50 min",
            summary: "Stateless vs stateful setups, PersistentVolumes, PersistentVolumeClaims, and environment injection using ConfigMaps.",
            content: `
### Kubernetes Storage & Configuration

By default, container filesystems are wiped when containers crash. Storing application configurations within images makes configurations hard to update. K8s solves this using storage abstractions and ConfigMaps.

#### 1. Persistent Volumes (PV) & Claims (PVC):
* **PersistentVolume (PV):** A cluster storage resource provisioned by administrators (e.g., local directories, AWS EBS volumes, NFS). It exists outside of Pod lifecycles.
* **PersistentVolumeClaim (PVC):** A request for storage by a user/Pod. K8s matches a PVC to a compatible PV and binds them.

#### 2. ConfigMaps & Secrets:
* **ConfigMap:** Stores non-confidential configuration settings as key-value pairs, mounting them as environment variables or config files.
* **Secret:** Similar to ConfigMaps but encrypts data using Base64, useful for passwords, database keys, and certificates.

#### ConfigMap Mount YAML Example:
\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DB_HOST: "db.production.local"
  LOG_LEVEL: "info"
\`\`\`

#### Quiz Questions:
1. **Which resource maps a user request for storage capacity to actual cluster PersistentVolumes?**
   *   a) ConfigMap
   *   b) PersistentVolumeClaim (PVC) (Correct)
   *   c) Secret
2. **How do Secrets differ from ConfigMaps in Kubernetes?**
   *   a) Secrets are stored on disk, ConfigMaps in RAM
   *   b) Secrets store encrypted/obfuscated sensitive key parameters, whereas ConfigMaps store plain text configurations (Correct)
   *   c) They are the same thing

#### Interview Questions:
* **Explain the lifecycle difference between a Pod volume and a PersistentVolume (PV).**
  *   *Answer:* A Pod volume is tied directly to the lifetime of the host Pod. When the Pod is deleted, the volume is destroyed. A PersistentVolume (PV) exists independently of Pods, persisting its data when Pod mounts change.
* **How do you inject ConfigMap keys into container environment variables?**
  *   *Answer:* Inside the Pod manifest template, use the \`envFrom\` or \`valueFrom\` key referencing the ConfigMap name and target key, injecting the values at boot time.

#### Summary:
PVs provision storage; PVCs claim it. ConfigMaps inject environment variables into containers, while Secrets handle sensitive data.
            `,
            exercise: "Draft a Pod manifest mounting a ConfigMap key as a file path inside '/etc/config/db_host'."
          },
          {
            id: "do-l-3-3",
            title: "CI/CD Principles & Pipelines Design",
            time: "50 min",
            summary: "Continuous Integration vs Continuous Delivery, deployment pipelines stages, and release models.",
            content: `
### CI/CD Principles & Pipelines Design

CI/CD automates manual developer tasks, shortening the cycle between writing code and shipping software to production.

#### 1. Continuous Integration (CI):
Developers merge code changes into a central repository frequently. Each merge triggers an automated build and test pipeline:
* **Goal:** Catch bugs quickly, ensure compilation holds, and prevent regression.

#### 2. Continuous Delivery vs. Deployment:
* **Continuous Delivery (CD):** Code builds and test gates run automatically. Release candidates are packaged and staged, requiring a **manual approval button** to deploy to production.
* **Continuous Deployment:** Every code change passing the test pipeline is deployed **automatically** to production without human intervention.

#### Pipeline Flow Visual:
\`\`\`
[ Commit Code ] ===> [ Build Container ] ===> [ Run Unit Tests ] ===> [ Staging Deploy ] ===> [ Prod Deploy ]
\`\`\`

#### Quiz Questions:
1. **What is the difference between Continuous Delivery and Continuous Deployment?**
   *   a) Delivery requires manual database resets
   *   b) Continuous Delivery requires a manual step to push to production, whereas Continuous Deployment deploys code changes automatically (Correct)
   *   c) Delivery is only for mobile apps
2. **What is the primary objective of Continuous Integration (CI)?**
   *   a) Automatic cloud billing
   *   b) Frequently building, checking, and testing code commits in a shared repository to identify issues early (Correct)
   *   c) Managing source licenses

#### Interview Questions:
* **Explain the concept of Shift Left in software delivery pipelines.**
  *   *Answer:* Shift Left refers to running security scanning, code linting, and automated testing early in the software delivery process. This catches errors early when they are cheap to fix, rather than waiting for production deployment reviews.
* **What is a build artifact in a pipeline?**
  *   *Answer:* A build artifact is a compiled executable, container image, or package produced during build phases. It is saved and passed to downstream stages (test and deploy) to guarantee identical code runs in all environments.

#### Summary:
CI automates commit builds and tests. Continuous Delivery staging is triggered automatically but requires approval to deploy; Continuous Deployment pushes code to production automatically.
            `,
            exercise: "Sketch a flowchart of a complete CI/CD pipeline, detailing the tests, scans, and triggers for each step."
          },
          {
            id: "do-l-3-4",
            title: "GitHub Actions Workflows & Runners",
            time: "50 min",
            summary: "YAML workflow syntax, events, jobs, steps, environment secrets, and hosted vs self-hosted runners.",
            content: `
### GitHub Actions Workflows & Runners

GitHub Actions integrates CI/CD directly inside GitHub repositories. Pipelines are defined using YAML scripts placed in the \`.github/workflows/\` directory.

#### Pipeline Terminology:
* **Workflow:** An automated process run by a trigger event (e.g. \`push\`, \`pull_request\`).
* **Job:** A set of steps executing on a Runner. Jobs run in parallel by default.
* **Step:** An individual task running commands or actions sequentially.
* **Runner:** The virtual machine execution environment where steps run.

#### GitHub Actions YAML Example:
\`\`\`yaml
name: Node CI Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Run Tests
        run: |
          npm install
          npm run test
\`\`\`

#### Quiz Questions:
1. **Where must GitHub Actions YAML files be stored in a repository to trigger automated runs?**
   *   a) \`/workflows\`
   *   b) \`.github/workflows/\` (Correct)
   *   c) \`/.git/workflows\`
2. **What is a Runner in GitHub Actions?**
   *   a) A code tracking interface
   *   b) The virtual server hosting the pipeline environment (Correct)
   *   c) A database engine

#### Interview Questions:
* **How do you manage API keys and passwords securely inside GitHub Actions?**
  *   *Answer:* I store credentials in the repository's **GitHub Secrets** console. Inside the YAML file, I inject them as environment variables using context expressions like \`\${{ secrets.DATABASE_KEY }}\`, keeping secrets hidden from logs.
* **What is the difference between GitHub-hosted and self-hosted runners?**
  *   *Answer:* GitHub-hosted runners are clean VMs maintained by GitHub. Self-hosted runners are custom servers managed by users, which is useful for specialized hardware setups, faster builds, or private network deployments.

#### Summary:
GitHub Actions maps events to workflows in \`.github/workflows/\`. Jobs run on runners, accessing parameters and secrets securely.
            `,
            exercise: "Write a GitHub Actions script that runs lint tests on pull request events targeting the 'develop' branch."
          },
          {
            id: "do-l-3-5",
            title: "Jenkins Pipelines: Declarative vs Scripted Syntax",
            time: "55 min",
            summary: "Jenkinsfiles, Declarative vs Scripted syntax, stages, steps, triggers, and post-execution hooks.",
            content: `
### Jenkins Pipelines

Jenkins is a popular self-hosted open-source automation server used to orchestrate complex deployment pipelines.

#### Declarative vs. Scripted Syntax:
1. **Declarative (Recommended):** Uses a structured, user-friendly YAML-like syntax, checking configurations for errors before running:
   * Wraps operations in a \`pipeline { }\` block.
2. **Scripted:** Traditional Groovy-based scripting offering maximum flexibility but complex to write:
   * Wraps operations in a \`node { }\` block.

#### Declarative Jenkinsfile Example:
\`\`\`groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Test') {
            steps {
                sh 'npm install'
                sh 'npm run test'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
\`\`\`

#### Quiz Questions:
1. **Which Jenkinsfile root block represents modern, structured declarative pipelines?**
   *   a) node { }
   *   b) pipeline { } (Correct)
   *   c) run { }
2. **What is the purpose of the 'post' block in a Jenkins pipeline?**
   *   a) To declare environment settings
   *   b) To run tasks conditionally based on success, failure, or always at the end of the pipeline (Correct)
   *   c) To post requests to API channels

#### Interview Questions:
* **Explain how Jenkins agents (executors) help distribute pipeline loads.**
  *   *Answer:* Jenkins uses a master-agent architecture. The master node hosts the UI and orchestrates tasks. Agents are helper nodes connected to the master. The master delegates build stages to run on specific agents, preventing resource saturation.
* **How does the cleanWs() utility help maintain Jenkins nodes?**
  *   *Answer:* It wipes the current workspace directory at the end of a build, preventing disk space leaks on runners from old build files.

#### Summary:
Jenkins orchestrates automation using pipelines declared in a Jenkinsfile. Declarative pipelines use structured stages, steps, and post hooks.
            `,
            exercise: "Write a declarative Jenkins pipeline containing 'Build' and 'Deploy' stages, executing shell commands for each."
          }
        ]
      },
      {
        id: "do-m-4",
        title: "Module 4: Infrastructure as Code, Monitoring & DevSecOps",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Explain Terraform state files and compute resource plans",
          "Deploy configuration automation using Ansible playbooks",
          "Configure Prometheus loggers and Grafana charts",
          "Analyze container images for vulnerabilities using Trivy",
          "Integrate secure secrets management protocols"
        ],
        lessons: [
          {
            id: "do-l-4-1",
            title: "Infrastructure as Code (IaC) & Terraform Basics",
            time: "50 min",
            summary: "Declarative vs imperative infrastructure, HCL syntax, provider endpoints, and resources initialization.",
            content: `
### Infrastructure as Code (IaC) & Terraform

Managing server infrastructures manually (e.g. clicking through web consoles) is slow and prone to errors. Infrastructure as Code (IaC) defines infrastructure in code files, enabling version control and repeatable setups.

#### Declarative vs. Imperative:
* **Imperative (e.g. Ansible, Bash):** You write commands detailing *how* to build the server (step-by-step).
* **Declarative (e.g. Terraform):** You describe the *desired end state* (e.g. "I want 3 VMs and 1 Load Balancer"). Terraform figures out the changes needed to achieve this.

#### HashiCorp Configuration Language (HCL):
Terraform uses HCL files (\`.tf\`) to declare infrastructure.

#### Terraform HCL Code Example:
\`\`\`hcl
# 1. Define AWS Provider
provider "aws" {
  region = "us-east-1"
}

# 2. Declare an EC2 instance resource
resource "aws_instance" "web_server" {
  ami           = "ami-0c7217cdde317cfec"
  instance_type = "t2.micro"

  tags = {
    Name = "ProductionWeb"
  }
}
\`\`\`

#### Quiz Questions:
1. **What type of IaC tool is Terraform?**
   *   a) Imperative configuration tool
   *   b) Declarative provisioning tool (Correct)
   *   c) Container runtime
2. **What does the command 'terraform plan' do?**
   *   a) Deletes infrastructure
   *   b) Generates an execution plan showing exactly what resources will be created, modified, or destroyed (Correct)
   *   c) Restarts local databases

#### Interview Questions:
* **How does Terraform know what resources exist in the real cloud?**
  *   *Answer:* Terraform tracks resources in a local or remote **state file** (\`terraform.tfstate\`). When you run operations, it compares your code with the state file and real-world configurations to calculate changes.
* **Explain how 'terraform init' initializes workspaces.**
  *   *Answer:* It reads your \`.tf\` configuration files, identifies the cloud provider blocks (like AWS or GCP), downloads the necessary provider plugins into local directories, and configures backend state files.

#### Summary:
IaC defines cloud setups in code files. Terraform uses HCL to provision resources declaratively, comparing configurations to state files to update systems.
            `,
            exercise: "Initialize a local mock directory with a Terraform main.tf file, run terraform init, and inspect the created .terraform folder."
          },
          {
            id: "do-l-4-2",
            title: "Terraform State Files & Module Designs",
            time: "50 min",
            summary: "Terraform state locks, remote backends, code modularity, outputs mapping, and variables parameters.",
            content: `
### Terraform State & Modules

As teams grow, managing shared infrastructure requires remote state locks and code modularity.

#### 1. Remote State & Locking:
If two developers run \`terraform apply\` simultaneously, state files can corrupt.
* **Remote Backend:** Stores state files in secure shared locations (e.g., AWS S3, Google Cloud Storage).
* **State Locking:** Uses databases (e.g. AWS DynamoDB) to lock the state file during runs, preventing duplicate executions.

#### 2. Modularity:
Modules allow developers to package infrastructure into reusable configurations:
\`\`\`hcl
module "vpc" {
  source   = "./modules/vpc"
  cidr_block = "10.0.0.0/16"
}
\`\`\`

#### Quiz Questions:
1. **Why is it important to configure state locking in team environments?**
   *   a) To speed up downloads
   *   b) To lock the state file during runs, preventing concurrent execution from corrupting the file (Correct)
   *   c) To reduce cloud billing costs
2. **What folder path defines local module directories inside Terraform configurations?**
   *   a) The source argument inside the module block (Correct)
   *   b) The output blocks file
   *   c) Node_modules

#### Interview Questions:
* **Why should you never commit terraform.tfstate files to Git?**
  *   *Answer:* State files contain plain text metadata of all provisioned cloud resources, which can include sensitive database passwords, private keys, and API tokens. They must be stored in secure remote backends with encryption enabled.
* **How do variables and outputs improve Terraform modules?**
  *   *Answer:* Variables act as input parameters to customize modules (e.g. setting instance sizes). Outputs export resource attributes (e.g. exporting a created DB's IP address) to pass to other configurations.

#### Summary:
Remote state backends store state securely. State locking prevents concurrent run collisions, and modules package resources into reusable blocks.
            `,
            exercise: "Create a local module folder, declare variables in variables.tf, and invoke it from a main.tf file."
          },
          {
            id: "do-l-4-3",
            title: "Ansible Playbooks & Configuration Management",
            time: "50 min",
            summary: "Ansible YAML syntax, agentless architectures, inventory hosts mapping, and writing simple tasks.",
            content: `
### Ansible Configuration Management

While Terraform provisions infrastructure (VMs, networks), **Ansible** configures the operating systems and installs software on those VMs.

#### Agentless Architecture:
Unlike tools requiring agent daemons on target nodes (e.g. Chef, Puppet), Ansible is **agentless**. It connects to target servers using standard **SSH**, runs Python code, and deletes it upon completion.

#### Key Components:
* **Inventory:** A text file listing target server IP addresses grouped by role (e.g. web, db).
* **Playbook:** A YAML file defining a list of configuration tasks to apply to target hosts.
* **Idempotence:** Ansible only applies changes if target servers deviate from the playbook configuration, avoiding duplicate configurations.

#### Ansible Playbook Example:
\`\`\`yaml
- name: Setup Web Server
  hosts: webservers
  become: yes
  tasks:
    - name: Install Apache Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Start Nginx service
      service:
        name: nginx
        state: started
        enabled: yes
\`\`\`

#### Quiz Questions:
1. **What protocol does Ansible use to connect to and configure Linux target nodes?**
   *   a) HTTP
   *   b) SSH (Correct)
   *   c) FTP
2. **What does idempotence mean in configuration management?**
   *   a) The pipeline always fails
   *   b) The tool checks target states and executes changes only if the current state deviates from the playbook design (Correct)
   *   c) Running tasks on multiple servers at once

#### Interview Questions:
* **How does Ansible's agentless architecture simplify server management?**
  *   *Answer:* It eliminates the need to install, update, and manage agent daemon software on target nodes. Since it uses standard SSH, servers require no configuration other than adding Ansible's SSH public key.
* **What is the difference between an Ansible task and a handler?**
  *   *Answer:* A task runs sequentially on every execution. A handler is a conditional task triggered by a notify directive, running only when a task reports a change (e.g. restarting a service only when its configuration file is updated).

#### Summary:
Ansible is an agentless, SSH-based configuration tool. Playbooks define target states in YAML, executing tasks idempotently on inventory hosts.
            `,
            exercise: "Write a mock Ansible playbook containing tasks to create a directory named '/var/www/site' and set its permissions to 755."
          },
          {
            id: "do-l-4-4",
            title: "Prometheus & Grafana Performance Monitoring",
            time: "50 min",
            summary: "Pull metrics collections, scraping configurations, PromQL query basics, and Grafana dashboard bindings.",
            content: `
### Prometheus & Grafana Monitoring

Monitoring tracks system health, detects performance bottlenecks, and alerts teams before outages happen.

#### 1. Prometheus (Metrics Collection):
An open-source time-series database optimized for metrics:
* **Pull-Based Model:** Prometheus queries (scrapes) target endpoints (e.g. \`http://server/metrics\`) at regular intervals to pull performance metrics.
* **Metrics Exporters:** Small helper programs (like Node Exporter) that translate OS performance stats into Prometheus format.
* **PromQL:** The query language used to calculate metrics over time.

#### 2. Grafana (Visualization):
An analytics platform that connects to Prometheus, converting metric time-series data into interactive charts and dashboards.

#### Prometheus Scrape Config YAML:
\`\`\`yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['localhost:9100']
\`\`\`

#### Quiz Questions:
1. **How does Prometheus collect performance metrics from target systems?**
   *   a) Targets push logs using HTTP POST
   *   b) Prometheus pulls metrics from target endpoints at configured scrape intervals (Correct)
   *   c) Using SQL queries
2. **Which component translates host OS parameters like CPU and memory usage into Prometheus metrics?**
   *   a) Grafana Dashboard
   *   b) Node Exporter (Correct)
   *   c) Docker Engine

#### Interview Questions:
* **Explain the difference between logging, metrics, and tracing (Three Pillars of Observability).**
  *   *Answer:* **Metrics** are numeric values tracked over time (e.g. CPU load), good for alerting. **Logs** are text records of specific events (e.g., error stack traces), good for debugging details. **Tracing** tracks a single request's path across microservices, good for locating latency bottlenecks.
* **What is PromQL, and how do you calculate CPU usage with it?**
  *   *Answer:* PromQL is Prometheus's query language. To calculate CPU usage, you query CPU active time and compute rate changes over time, like: \`100 - (rate(node_cpu_seconds_total{mode="idle"}[5m]) * 100)\`.

#### Summary:
Prometheus scrapes metrics using a pull-based model. Grafana connects to Prometheus to visualize time-series metrics.
            `,
            exercise: "Research the four Golden Signals of monitoring in DevOps, listing and defining each signal."
          },
          {
            id: "do-l-4-5",
            title: "DevSecOps: Trivy Scan & Vault Secrets",
            time: "55 min",
            summary: "Integrating security into pipelines, scanning container vulnerabilities, and managing secrets using HashiCorp Vault.",
            content: `
### DevSecOps: Security Integration

DevSecOps integrates security audits directly into the CI/CD pipeline, catching vulnerabilities before code reaches production.

#### 1. Container Image Scanning (Trivy):
Trivy is a vulnerability scanner for containers. It scans image layers for outdated libraries, OS vulnerabilities (CVEs), and hardcoded credentials.

#### 2. Pipeline Integration:
If a scan finds critical vulnerabilities, the pipeline exits with an error code, stopping deployment.
\`\`\`bash
# Run Trivy scan on a local image and fail if critical issues exist
trivy image --severity CRITICAL --exit-code 1 my-app:latest
\`\`\`

#### 3. Secrets Management (HashiCorp Vault):
Hardcoding API keys or passwords in code repositories or server configuration files is a major security risk.
* **Vault** stores sensitive data encrypted in memory.
* Applications authenticate using temp tokens to retrieve secrets dynamically, preventing hardcoded credentials.

#### Quiz Questions:
1. **What does Trivy scan container images for?**
   *   a) Code style layouts
   *   b) Outdated dependencies, known CVE vulnerabilities, and leaked secrets (Correct)
   *   c) File compression ratios
2. **Why should you manage credentials using tools like HashiCorp Vault instead of committing them to Git?**
   *   a) Vault speeds up server boot times
   *   b) Committing secrets to Git leaves credentials exposed in the repository history, whereas Vault stores them encrypted with access controls (Correct)
   *   c) Git does not support text parameters

#### Interview Questions:
* **What is secret rotation, and how does Vault simplify it?**
  *   *Answer:* Secret rotation is the practice of replacing access keys frequently to reduce the impact of potential leaks. Vault supports **Dynamic Secrets**, generating temporary credentials on the fly (e.g., database user logins) that automatically expire, eliminating manual rotation tasks.
* **How do you integrate image scanning into a GitHub Actions workflow?**
  *   *Answer:* I add a step that uses the Trivy action to scan the built container image after build steps. I configure it to return a non-zero exit code on critical errors, which halts the pipeline and blocks deployment pushes.

#### Summary:
DevSecOps integrates scans and security early. Use Trivy to audit container images, and manage secrets dynamically using Vault.
            `,
            exercise: "Write a step in a GitHub Actions workflow that executes a Trivy scan on a built image, reporting results to a dashboard file."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "DevOps Reference Guides",
    items: [
      { name: "Docker Official Reference Docs", desc: "Guide on writing Dockerfiles, compose setups, and volume controls.", link: "https://docs.docker.com" },
      { name: "Kubernetes User Operations Manual", desc: "Detailed breakdown of manifests, networking services, and kubectl.", link: "https://kubernetes.io/docs" },
      { name: "Terraform HCL Syntax Documentation", desc: "Declarative resource templates, modules, and backend states configuration.", link: "https://developer.hashicorp.com/terraform/docs" },
      { name: "Ansible Playbook User Guide", desc: "Writing configuration tasks, inventories, and handler templates.", link: "https://docs.ansible.com" }
    ]
  }
];

export const glossary = [
  { term: "Linux permission codes", def: "Numeric mappings setting Read (4), Write (2), and Execute (1) access limits on folders." },
  { term: "Git Reflog", def: "A local history log tracking every movements of HEAD, enabling recovery of deleted code." },
  { term: "Namespace Isolation", def: "Linux kernel feature wrapping system resources into virtual views per process." },
  { term: "Multi-Stage Build", def: "Optimization pattern using multiple FROM stages to copy build artifacts into tiny images." },
  { term: "Bridge Network", def: "Default container network driver creating an isolated subnet for inter-container communication." },
  { term: "Ingress Router", def: "Reverse proxy routing external HTTP paths to internal Kubernetes services." },
  { term: "Persistent Volume", def: "Cluster storage resource existing outside pod lifecycles." },
  { term: "Declarative IaC", def: "Provisioning pattern where developers describe target end-states, leaving resource actions to tool engines." },
  { term: "Idempotence", def: "Property ensuring operations can run repeatedly without changing the target state unless deviations exist." },
  { term: "Prometheus scraping", def: "Active pull-based metric collection gathering time-series metrics from metrics targets." }
];
