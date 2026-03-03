import { useHealth } from "../hooks";
import { Button } from "@/components/ui/button";

export function HealthPage() {
    const { data, isLoading, isError, error, refetch } = useHealth();

    return (
        <div className="flex flex-col items-center justify-center gap-6 py-20">
            <h1 className="text-4xl font-bold tracking-tight">
                Fundraising Platform
            </h1>
            <p className="text-muted-foreground">Backend Health Check</p>

            <div className="rounded-lg border bg-card p-6 shadow-sm w-full max-w-md">
                {isLoading && (
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span className="text-sm text-muted-foreground">
                            Checking backend status...
                        </span>
                    </div>
                )}

                {isError && (
                    <div className="space-y-2 text-center">
                        <p className="text-sm font-medium text-destructive">
                            Connection failed
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {error instanceof Error ? error.message : "Unknown error"}
                        </p>
                    </div>
                )}

                {data && (
                    <div className="space-y-2 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            {data.status}
                        </div>
                        <p className="text-sm text-muted-foreground">{data.message}</p>
                    </div>
                )}
            </div>

            <Button onClick={() => refetch()} variant="outline" size="sm">
                Refresh Status
            </Button>
        </div>
    );
}
