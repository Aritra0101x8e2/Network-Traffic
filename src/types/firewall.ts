
// Type definitions for the firewall dashboard

export type Protocol = 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS';
export type TrafficStatus = 'Allowed' | 'Blocked' | 'Suspicious' | 'Flagged';

export interface TrafficPacket {
  id: string;
  timestamp: Date;
  sourceIP: string;
  destinationIP: string;
  protocol: Protocol;
  port: number;
  status: TrafficStatus;
  bytesTransferred?: number;
}

export interface FirewallRule {
  id: string;
  name: string;
  sourceIP: string;
  destinationIP?: string;
  protocol?: Protocol;
  port?: number;
  action: 'Allow' | 'Block';
  createdAt: Date;
  enabled: boolean;
}

export interface TrafficAlert {
  id: string;
  timestamp: Date;
  message: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  relatedTrafficId?: string;
  acknowledged: boolean;
}

export interface TrafficSummary {
  timestamp: Date;
  allowed: number;
  blocked: number;
  suspicious: number;
  total: number;
}
