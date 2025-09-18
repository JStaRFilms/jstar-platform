import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withCache, generateCacheKey, CACHE_TTL } from '@/lib/api-cache';

const prisma = new PrismaClient();

// Helper function to run full system diagnostics
async function runFullSystemDiagnostics() {
  const startTime = Date.now();

  try {
    // Use cached system metrics to avoid duplicate calls
    const cacheKey = generateCacheKey('/api/admin/system-metrics');
    const systemData = await withCache(cacheKey, async () => {
      // If not cached, fetch fresh data
      const response = await fetch('http://localhost:3000/api/admin/system-metrics', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system metrics');
      }

      return await response.json();
    }, { ttl: CACHE_TTL.SYSTEM_METRICS });

    if (systemData.status !== 'success') {
      throw new Error('System metrics API returned error');
    }

    // Run comprehensive benchmarks (separate call to avoid caching benchmarks)
    const benchmarkResponse = await fetch('http://localhost:3000/api/admin/system-metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let benchmarkData = null;
    if (benchmarkResponse.ok) {
      const benchResult = await benchmarkResponse.json();
      if (benchResult.status === 'success') {
        benchmarkData = benchResult.data;
      }
    }

    // Analyze results and determine status
    const analysis = analyzeDiagnosticResults(systemData.data, benchmarkData);
    const duration = Date.now() - startTime;

    // Calculate performance score (0-10 scale)
    const performanceScore = calculatePerformanceScore(systemData.data, benchmarkData);

    return {
      type: 'FULL_SYSTEM' as const,
      status: analysis.status,
      duration,
      title: 'Full System Diagnostic',
      summary: `Performance Score: ${performanceScore}/10`,
      results: {
        systemMetrics: systemData.data,
        benchmarkResults: benchmarkData,
        analysis: analysis.details,
        performanceScore,
        timestamp: new Date().toISOString()
      },
      warnings: analysis.warnings,
      errors: analysis.errors
    };

  } catch (error) {
    console.error('Full system diagnostic error:', error);
    return {
      type: 'FULL_SYSTEM' as const,
      status: 'FAILED' as const,
      duration: Date.now() - startTime,
      title: 'Full System Diagnostic',
      summary: 'Diagnostic failed - check system logs',
      results: {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      warnings: 0,
      errors: 1
    };
  }
}

// Helper function to analyze diagnostic results
function analyzeDiagnosticResults(systemData: any, benchmarkData: any) {
  let warnings = 0;
  let errors = 0;
  let status: 'PASSED' | 'WARNINGS' | 'FAILED' = 'PASSED';
  const details: string[] = [];

  // Check CPU usage
  if (systemData.cpu?.usage > 90) {
    errors++;
    status = 'FAILED';
    details.push('Critical CPU usage detected');
  } else if (systemData.cpu?.usage > 70) {
    warnings++;
    status = status === 'PASSED' ? 'WARNINGS' : status;
    details.push('High CPU usage detected');
  }

  // Check memory usage
  if (systemData.memory?.percentage > 95) {
    errors++;
    status = 'FAILED';
    details.push('Critical memory usage detected');
  } else if (systemData.memory?.percentage > 85) {
    warnings++;
    status = status === 'PASSED' ? 'WARNINGS' : status;
    details.push('High memory usage detected');
  }

  // Check storage usage
  if (systemData.disk?.percentage > 95) {
    errors++;
    status = 'FAILED';
    details.push('Critical storage usage detected');
  } else if (systemData.disk?.percentage > 85) {
    warnings++;
    status = status === 'PASSED' ? 'WARNINGS' : status;
    details.push('High storage usage detected');
  }

  // Check AI models
  if (!systemData.aiModels?.running && systemData.aiHealth?.ollama?.status === 'not_detected') {
    warnings++;
    status = status === 'PASSED' ? 'WARNINGS' : status;
    details.push('No AI models currently running');
  }

  // Check benchmark results if available
  if (benchmarkData) {
    if (benchmarkData.cpu?.utilization > 90) {
      warnings++;
      status = status === 'PASSED' ? 'WARNINGS' : status;
      details.push('High CPU utilization during benchmarks');
    }

    if (benchmarkData.gpu && !benchmarkData.gpu.available) {
      details.push('GPU not available for benchmarking');
    }
  }

  return {
    status,
    warnings,
    errors,
    details
  };
}

// Helper function to calculate performance score
function calculatePerformanceScore(systemData: any, benchmarkData: any): number {
  let score = 10; // Start with perfect score

  // CPU performance (30% weight)
  if (systemData.cpu?.usage > 80) score -= 3;
  else if (systemData.cpu?.usage > 60) score -= 1.5;

  // Memory performance (25% weight)
  if (systemData.memory?.percentage > 85) score -= 2.5;
  else if (systemData.memory?.percentage > 70) score -= 1.25;

  // Storage performance (20% weight)
  if (systemData.disk?.percentage > 85) score -= 2;
  else if (systemData.disk?.percentage > 70) score -= 1;

  // AI performance (15% weight)
  if (!systemData.aiModels?.running) score -= 1.5;
  if (systemData.aiHealth?.gpu?.utilization > 80) score -= 1;

  // Benchmark performance (10% weight)
  if (benchmarkData?.cpu?.utilization > 80) score -= 1;

  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}

// GET /api/admin/diagnostics - Fetch diagnostic history
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  // Generate cache key based on query parameters
  const cacheKey = generateCacheKey('/api/admin/diagnostics', { type, status, limit });

  try {
    // Use caching with deduplication for diagnostic history
    const result = await withCache(cacheKey, async () => {
      console.log('Fetching fresh diagnostic history...');

      // Build where clause
      const where: any = {};
      if (type) where.type = type;
      if (status) where.status = status;

      const diagnostics = await prisma.diagnosticHistory.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: limit,
      });

      return {
        status: 'success',
        data: diagnostics,
        cached: false
      };
    }, { ttl: CACHE_TTL.DIAGNOSTICS }); // 5-minute TTL for diagnostic history

    // Mark as cached if it came from cache
    if (result.cached !== false) {
      result.cached = true;
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching diagnostic history:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch diagnostic history',
      cached: false
    }, { status: 500 });
  }
}

// POST /api/admin/diagnostics - Run full system diagnostics
export async function POST() {
  try {
    console.log('Starting full system diagnostics...');

    // Run the comprehensive diagnostic
    const diagnosticResult = await runFullSystemDiagnostics();

    // Save to database
    const savedDiagnostic = await prisma.diagnosticHistory.create({
      data: {
        type: diagnosticResult.type,
        status: diagnosticResult.status,
        duration: diagnosticResult.duration,
        title: diagnosticResult.title,
        summary: diagnosticResult.summary,
        results: diagnosticResult.results,
        warnings: diagnosticResult.warnings,
        errors: diagnosticResult.errors,
      }
    });

    // Update last run timestamp in config
    await prisma.diagnosticConfig.upsert({
      where: { id: 'default' },
      update: { lastRun: new Date() },
      create: {
        id: 'default',
        autoEnabled: true,
        autoInterval: 3600000, // 1 hour
        lastRun: new Date(),
        runFullSystem: true,
        runAIBenchmark: true,
        runStorageScan: true,
        runNetworkTest: false,
      }
    });

    console.log('Full system diagnostics completed successfully');

    return NextResponse.json({
      status: 'success',
      data: savedDiagnostic
    });

  } catch (error) {
    console.error('Error running diagnostics:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to run diagnostics',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
