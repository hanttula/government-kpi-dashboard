-- CreateTable
CREATE TABLE "KPILiveData" (
    "kpiId" TEXT NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "trendValue" DOUBLE PRECISION NOT NULL,
    "trend" TEXT NOT NULL,
    "asOfDate" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KPILiveData_pkey" PRIMARY KEY ("kpiId")
);

-- CreateTable
CREATE TABLE "KPIHistoricalPoint" (
    "id" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "annotation" TEXT,

    CONSTRAINT "KPIHistoricalPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KPIHistoricalPoint_kpiId_idx" ON "KPIHistoricalPoint"("kpiId");

-- CreateIndex
CREATE UNIQUE INDEX "KPIHistoricalPoint_kpiId_period_key" ON "KPIHistoricalPoint"("kpiId", "period");
