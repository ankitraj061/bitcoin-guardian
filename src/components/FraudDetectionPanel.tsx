
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Check, Info, Shield, X } from 'lucide-react';

interface SuspiciousActivity {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  resolved: boolean;
}

const FraudDetectionPanel = () => {
  // This would be fetched from an API in a real application
  const [activities, setActivities] = useState<SuspiciousActivity[]>([
    {
      type: "Unusual Transaction",
      description: "Large transaction detected from previously inactive address",
      severity: "medium",
      timestamp: "2023-08-15T14:23:00Z",
      resolved: false
    },
    {
      type: "Phishing Attempt",
      description: "Potential phishing website mimicking popular exchange detected",
      severity: "high",
      timestamp: "2023-08-14T09:45:00Z",
      resolved: false
    },
    {
      type: "Whale Movement",
      description: "Large holder moved significant amount of BTC to exchange",
      severity: "low",
      timestamp: "2023-08-13T18:12:00Z",
      resolved: true
    },
    {
      type: "Market Manipulation",
      description: "Coordinated buy orders detected possibly influencing price",
      severity: "medium",
      timestamp: "2023-08-12T22:30:00Z",
      resolved: true
    }
  ]);

  const toggleResolved = (index: number) => {
    const updatedActivities = [...activities];
    updatedActivities[index].resolved = !updatedActivities[index].resolved;
    setActivities(updatedActivities);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <Info size={20} className="text-blue-500" />;
      case "medium":
        return <Shield size={20} className="text-yellow-500" />;
      case "high":
        return <AlertTriangle size={20} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      default:
        return "";
    }
  };

  // Calculate summary stats
  const totalActivities = activities.length;
  const unresolvedActivities = activities.filter(a => !a.resolved).length;
  const highSeverity = activities.filter(a => a.severity === "high" && !a.resolved).length;

  return (
    <Card className="glass-card w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h3 className="text-xl font-bold mb-2 md:mb-0">Fraud Detection Monitor</h3>
          
          <div className="flex space-x-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Total Alerts:</span>{" "}
              <span className="font-medium">{totalActivities}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Unresolved:</span>{" "}
              <span className="font-medium text-yellow-500">{unresolvedActivities}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">High Severity:</span>{" "}
              <span className="font-medium text-red-500">{highSeverity}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className={`bg-muted/10 rounded-lg p-4 transition-all duration-300 ${
                activity.resolved ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {getSeverityIcon(activity.severity)}
                  <h4 className="ml-2 font-medium">{activity.type}</h4>
                </div>
                <div className="flex items-center">
                  <div className={`px-3 py-1 text-xs font-medium rounded-full border mr-3 ${getSeverityColor(activity.severity)}`}>
                    {activity.severity.charAt(0).toUpperCase() + activity.severity.slice(1)}
                  </div>
                  <button 
                    className={`p-1 rounded-full ${
                      activity.resolved
                        ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                        : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                    }`}
                    onClick={() => toggleResolved(index)}
                  >
                    {activity.resolved ? <Check size={16} /> : <X size={16} />}
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
                <span>
                  Status: {activity.resolved ? 'Resolved' : 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-muted">
          <h4 className="font-medium mb-3">AI Fraud Detection</h4>
          <p className="text-sm text-muted-foreground">
            Our AI continuously monitors blockchain transactions, exchange activities, and community signals to identify potential 
            fraud, suspicious activities, and market manipulation tactics that could impact Bitcoin prices or security.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudDetectionPanel;
