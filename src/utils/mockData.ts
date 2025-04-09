
import { TrafficPacket, Protocol, TrafficStatus, TrafficAlert, FirewallRule } from '@/types/firewall';
import { v4 as uuidv4 } from 'uuid';

// Function to generate a random IP address
export const generateRandomIP = (): string => {
  return Array(4)
    .fill(0)
    .map(() => Math.floor(Math.random() * 256))
    .join('.');
};

// Function to generate a random port number
export const generateRandomPort = (): number => {
  return Math.floor(Math.random() * (65535 - 1024) + 1024);
};

// Array of protocols to pick from
const protocols: Protocol[] = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];

// Function to pick a random protocol
export const randomProtocol = (): Protocol => {
  return protocols[Math.floor(Math.random() * protocols.length)];
};

// Function to pick a traffic status - weighted for mostly allowed traffic
export const randomStatus = (): TrafficStatus => {
  const random = Math.random();
  if (random > 0.9) return 'Blocked';
  if (random > 0.8) return 'Suspicious';
  if (random > 0.75) return 'Flagged';
  return 'Allowed';
};

// Function to generate a random traffic packet
export const generateRandomTrafficPacket = (): TrafficPacket => {
  const protocol = randomProtocol();
  const status = randomStatus();
  
  return {
    id: uuidv4(),
    timestamp: new Date(),
    sourceIP: generateRandomIP(),
    destinationIP: generateRandomIP(),
    protocol,
    port: generateRandomPort(),
    status,
    bytesTransferred: Math.floor(Math.random() * 100000)
  };
};

// Generate an alert based on a traffic packet
export const generateAlertFromPacket = (packet: TrafficPacket): TrafficAlert | null => {
  if (packet.status === 'Allowed') return null;
  
  let severity: 'Low' | 'Medium' | 'High' | 'Critical';
  let message: string;
  
  if (packet.status === 'Blocked') {
    severity = 'Medium';
    message = `Blocked traffic from ${packet.sourceIP} to ${packet.destinationIP} on port ${packet.port}`;
  } else if (packet.status === 'Suspicious') {
    severity = 'High';
    message = `Suspicious ${packet.protocol} traffic detected from ${packet.sourceIP}`;
  } else {
    // Flagged
    severity = 'Low';
    message = `Flagged connection attempt to port ${packet.port} on ${packet.destinationIP}`;
  }
  
  // Randomly elevate some alerts to critical
  if (Math.random() > 0.9) {
    severity = 'Critical';
    message = `CRITICAL: ${message} - Possible intrusion attempt`;
  }
  
  return {
    id: uuidv4(),
    timestamp: new Date(),
    message,
    severity,
    relatedTrafficId: packet.id,
    acknowledged: false
  };
};

// Mock firewall rules
export const mockFirewallRules: FirewallRule[] = [
  {
    id: uuidv4(),
    name: "Block Suspicious IP",
    sourceIP: "192.168.1.100",
    action: "Block",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    enabled: true
  },
  {
    id: uuidv4(),
    name: "Allow Internal Traffic",
    sourceIP: "10.0.0.0/8",
    action: "Allow",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    enabled: true
  },
  {
    id: uuidv4(),
    name: "Block Telnet",
    port: 23,
    protocol: "TCP",
    action: "Block",
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    enabled: true
  }
];
