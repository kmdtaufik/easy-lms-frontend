"use client";

import { useState, useEffect } from "react";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconPlaylistX } from "@tabler/icons-react";
import { IconShoppingCart } from "@tabler/icons-react";
import { IconBook } from "@tabler/icons-react";
import { IconUsers } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function SectionCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/stats/dashboard`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return num.toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Card data configuration
  const cardData = [
    {
      title: "Total Signups",
      value: stats?.users?.totalSignups || 0,
      description: "Registered Users",
      icon: IconUsers,
      trend: stats?.users?.newSignupsThisMonth || 0,
      trendLabel: "new this month",
      formatter: formatNumber,
    },
    {
      title: "Total Customers",
      value: stats?.users?.totalCustomers || 0,
      description: "Enrolled Users",
      icon: IconShoppingCart,
      trend: stats?.users?.newCustomersThisMonth || 0,
      trendLabel: "new this month",
      formatter: formatNumber,
    },
    {
      title: "Total Courses",
      value: stats?.courses?.totalCourses || 0,
      description: `${stats?.courses?.publishedCourses || 0} Published`,
      icon: IconBook,
      trend: stats?.courses?.coursesCreatedThisMonth || 0,
      trendLabel: "created this month",
      formatter: formatNumber,
    },
    {
      title: "Total Revenue",
      value: stats?.enrollments?.totalRevenue || 0,
      description: `${formatCurrency(
        stats?.enrollments?.revenueThisMonth || 0
      )} this month`,
      icon: IconCurrencyDollar,
      trend: stats?.enrollments?.enrollmentsThisMonth || 0,
      trendLabel: "enrollments this month",
      formatter: formatCurrency,
    },
  ];

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader className="flex flex-row items-center justify-between space-y-4 pb-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-6 w-6 rounded" />
            </CardHeader>
            <Skeleton className="h-4 w-32 mx-6 mb-4" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Stats
            </CardTitle>
            <p className="text-muted-foreground">{error}</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardData.map((card, index) => {
        const Icon = card.icon;
        const hasTrend = card.trend !== null && card.trend !== undefined;
        const isPositiveTrend = card.trend > 0;

        return (
          <Card key={index} className="@container/card">
            <CardHeader className="flex flex-row items-center justify-between space-y-4 pb-2">
              <div>
                <CardDescription>{card.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {card.formatter(card.value)}
                </CardTitle>
              </div>
              <Icon className="size-6 text-muted-foreground" />
            </CardHeader>

            <div className="px-6 pb-4">
              <p className="text-muted-foreground text-sm mb-2">
                {card.description}
              </p>

              {hasTrend && card.trend > 0 && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isPositiveTrend ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {isPositiveTrend ? (
                      <IconTrendingUp className="size-3 mr-1" />
                    ) : (
                      <IconTrendingDown className="size-3 mr-1" />
                    )}
                    +{formatNumber(card.trend)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {card.trendLabel}
                  </span>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
