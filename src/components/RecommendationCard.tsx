import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  ArrowRightCircle, 
  Repeat,
  Info
} from "lucide-react";
import { Recommendation } from "@/services/recommendationService";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  // Get icon based on category
  const getIcon = () => {
    switch (recommendation.category) {
      case "buy":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "sell":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "dca":
        return <Repeat className="h-5 w-5 text-blue-500" />;
      default:
        return <ArrowRightCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get risk level color
  const getRiskColor = () => {
    switch (recommendation.riskLevel) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "";
    }
  };

  // Format time ago
  const timeAgo = () => {
    try {
      return formatDistanceToNow(new Date(recommendation.dateCreated), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  return (
    <Card className="w-full mb-4 overflow-hidden border-l-4 hover:shadow-md transition-shadow" 
      style={{ 
        borderLeftColor: recommendation.category === "buy" ? "var(--green-500)" :
          recommendation.category === "sell" ? "var(--red-500)" :
          recommendation.category === "dca" ? "var(--blue-500)" :
          recommendation.category === "alert" ? "var(--yellow-500)" : "var(--gray-500)"
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-lg">{recommendation.title}</CardTitle>
          </div>
          <Badge variant="outline" className={getRiskColor()}>
            {recommendation.riskLevel.charAt(0).toUpperCase() + recommendation.riskLevel.slice(1)} Risk
          </Badge>
        </div>
        <CardDescription className="flex justify-between mt-1">
          <span>Confidence: {recommendation.confidence}%</span>
          <span>{timeAgo()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>
        
        {recommendation.relatedMetrics && recommendation.relatedMetrics.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Related Metrics
            </h4>
            <div className="flex flex-wrap gap-2">
              {recommendation.relatedMetrics.map((metric, i) => (
                <div key={i} className="text-xs bg-muted rounded-md px-2 py-1 flex items-center">
                  <span className="font-medium mr-1">{metric.metric}:</span> 
                  <span className={
                    // Color code based on metric name
                    metric.metric.toLowerCase().includes('price') && metric.value < 0 ? "text-red-500" :
                    metric.metric.toLowerCase().includes('price') && metric.value > 0 ? "text-green-500" :
                    ""
                  }>{typeof metric.value === 'number' && metric.value % 1 !== 0 ? metric.value.toFixed(2) : metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/30 py-2">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs text-muted-foreground">
            Source: {recommendation.source.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={'#'} target="_blank" rel="noopener noreferrer">
                Learn More
              </a>
            </Button>
            <Button variant="default" size="sm">
              Apply
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecommendationCard;