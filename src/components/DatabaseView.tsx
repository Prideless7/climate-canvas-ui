import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { MeteoData } from "./Dashboard";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface DatabaseViewProps {
  stationData: MeteoData[];
  selectedStation: string;
  timePeriod: string;
}

export const DatabaseView = ({ stationData, selectedStation, timePeriod }: DatabaseViewProps) => {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Only admins can view database
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Only administrators can access the database view.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const totalPages = Math.ceil(stationData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = stationData.slice(startIndex, endIndex);

  const formatValue = (value: number | null | undefined, unit: string = "") => {
    if (value === null || value === undefined) return "N/A";
    return `${value.toFixed(2)}${unit}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Overview</CardTitle>
          <CardDescription>
            Raw meteorological data for {selectedStation} - {timePeriod}
          </CardDescription>
          <div className="flex gap-4 mt-4">
            <Badge variant="outline" className="text-sm">
              Total Records: {stationData.length}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Station: {selectedStation}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Period: {timePeriod}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Raw Data Table</CardTitle>
          <CardDescription>
            Paginated view of all meteorological readings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Temp (°C)</TableHead>
                  <TableHead>Humidity (%)</TableHead>
                  <TableHead>Precipitation (mm)</TableHead>
                  <TableHead>Wind Speed (m/s)</TableHead>
                  <TableHead>Solar Radiation (W/m²)</TableHead>
                  <TableHead>Pressure (hPa)</TableHead>
                  <TableHead>ETO (mm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((row, index) => (
                    <TableRow key={`${row.date}-${row.time}-${index}`}>
                      <TableCell className="font-medium">
                        {format(new Date(row.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{row.time}</TableCell>
                      <TableCell>{formatValue(row.temperature, "°C")}</TableCell>
                      <TableCell>{formatValue(row.humidity, "%")}</TableCell>
                      <TableCell>{formatValue(row.precipitation, "mm")}</TableCell>
                      <TableCell>{formatValue(row.windSpeed, "m/s")}</TableCell>
                      <TableCell>{formatValue(row.solarRadiation, "W/m²")}</TableCell>
                      <TableCell>{formatValue(row.pressure, "hPa")}</TableCell>
                      <TableCell>{formatValue(row.eto, "mm")}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No data available for the selected period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};