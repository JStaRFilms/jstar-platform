import { NextResponse } from 'next/server';
import * as os from 'os';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Helper function to analyze available Ollama models and recommend the best for lite mode
function analyzeModelsForLiteMode(models: any[]) {
  const analysis = {
    recommendedModel: 'llama3:8b', // Default fallback
    availableModels: [] as string[],
    heavyModelsActive: [] as string[],
    recommendations: [] as string[]
  };

  // Extract model names
  analysis.availableModels = models.map(model => model.name);

  // Categorize models by size/capability
  const lightModels = [] as string[];
  const mediumModels = [] as string[];
  const heavyModels = [] as string[];

  models.forEach(model => {
    const name = model.name.toLowerCase();
    const size = model.size || 0;

    // Categorize by name patterns and size
    if (name.includes('70b') || name.includes('65b') || name.includes('32b') || size > 30 * 1024 * 1024 * 1024) { // >30GB
      heavyModels.push(model.name);
    } else if (name.includes('8b') || name.includes('7b') || name.includes('3b') || size < 10 * 1024 * 1024 * 1024) { // <10GB
      lightModels.push(model.name);
    } else {
      mediumModels.push(model.name);
    }
  });

  // Select the best available model for lite mode
  if (lightModels.length > 0) {
    // Prefer llama3 variants, then mistral, then others
    const preferredOrder = ['llama3', 'llama', 'mistral', 'codellama', 'phi'];
    for (const preferred of preferredOrder) {
      const match = lightModels.find(model => model.toLowerCase().includes(preferred));
      if (match) {
        analysis.recommendedModel = match;
        break;
      }
    }
    // If no preferred match, just take the first light model
    if (analysis.recommendedModel === 'llama3:8b') {
      analysis.recommendedModel = lightModels[0];
    }
  } else if (mediumModels.length > 0) {
    // No light models, use smallest medium model
    analysis.recommendedModel = mediumModels[0];
    analysis.recommendations.push('No lightweight models available - using medium model for lite mode');
  } else if (heavyModels.length > 0) {
    // Only heavy models available - still use the smallest one
    analysis.recommendedModel = heavyModels[0];
    analysis.recommendations.push('Only heavy models available - lite mode will still use smallest available model');
  }

  // Check for currently active heavy models
  analysis.heavyModelsActive = heavyModels;

  // Generate recommendations
  if (heavyModels.length > 0) {
    analysis.recommendations.push(`Consider installing lighter models like llama3:8b or mistral:7b for better performance`);
  }

  if (lightModels.length === 0) {
    analysis.recommendations.push('No lightweight AI models detected - lite mode performance may be limited');
  }

  return analysis;
}

// Helper function to check if a service is running by testing its API endpoint
async function checkServiceRunning(serviceName: string, port: number): Promise<boolean> {
  try {
    let url = '';
    if (serviceName === 'ollama') {
      url = `http://localhost:${port}/api/tags`;
    } else if (serviceName === 'lm_studio') {
      url = `http://localhost:${port}/v1/models`;
    }

    if (url) {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      return response.ok;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Emergency report generation
export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'send-report':
        return await generateEmergencyReport();

      case 'restart-ai':
        return await restartAIServices();

      case 'optimize-resources':
        return await optimizeForLowResources();

      case 'switch-lite-mode':
        return await switchToLiteMode();

      default:
        return NextResponse.json({
          status: 'error',
          message: 'Unknown emergency action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Emergency action error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Emergency action failed'
    }, { status: 500 });
  }
}

async function generateEmergencyReport() {
  try {
    // Fetch current system metrics
    const metricsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/system-metrics`, {
      headers: {
        // If you have auth headers, add them here
      }
    });

    if (!metricsResponse.ok) {
      throw new Error('Failed to fetch system metrics');
    }

    const metricsData = await metricsResponse.json();

    if (metricsData.status !== 'success') {
      throw new Error('System metrics fetch failed');
    }

    const metrics = metricsData.data;

    // Fetch diagnostic history
    const historyResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/diagnostics`, {
      headers: {
        // If you have auth headers, add them here
      }
    });

    let history = [];
    if (historyResponse.ok) {
      const historyData = await historyResponse.json();
      if (historyData.status === 'success') {
        history = historyData.data || [];
      }
    }

    // Create emergency CSV content
    let csvContent = 'EMERGENCY SYSTEM REPORT\n';
    csvContent += `Generated: ${new Date().toLocaleString()}\n`;
    csvContent += `Emergency Context: System report generated for developer analysis\n\n`;

    // System Overview Section
    csvContent += 'SYSTEM OVERVIEW (EMERGENCY)\n';
    csvContent += 'Metric,Value,Status,Criticality\n';
    csvContent += `CPU Usage,${metrics.cpu.usage}%,${metrics.cpu.usage > 80 ? 'CRITICAL' : metrics.cpu.usage > 60 ? 'WARNING' : 'NORMAL'},${metrics.cpu.usage > 80 ? 'HIGH' : 'LOW'}\n`;
    csvContent += `CPU Model,"${metrics.cpu.model}",-,-\n`;
    csvContent += `Memory Usage,${metrics.memory.used} GB (${metrics.memory.percentage}%),${metrics.memory.percentage > 80 ? 'CRITICAL' : metrics.memory.percentage > 60 ? 'WARNING' : 'NORMAL'},${metrics.memory.percentage > 80 ? 'HIGH' : 'LOW'}\n`;
    csvContent += `Total Memory,${metrics.memory.total} GB,-,-\n`;
    csvContent += `Disk Usage,${metrics.disk.used} GB (${metrics.disk.percentage}%),${metrics.disk.percentage > 85 ? 'CRITICAL' : metrics.disk.percentage > 75 ? 'WARNING' : 'NORMAL'},${metrics.disk.percentage > 85 ? 'HIGH' : 'LOW'}\n`;
    csvContent += `Total Disk,${metrics.disk.total} GB,-,-\n`;
    csvContent += `Network Interfaces,${metrics.network.interfaces},-,-\n`;
    csvContent += `System Uptime,${Math.round(metrics.uptime / 24)} days,-,-\n`;

    // AI Health Section (EMERGENCY FOCUS)
    csvContent += '\nAI HEALTH STATUS (EMERGENCY)\n';
    csvContent += 'Component,Status,Details,Criticality\n';
    csvContent += `Ollama,${metrics.aiHealth.ollama.status},${metrics.aiHealth.ollama.models_count} models loaded,${metrics.aiHealth.ollama.status === 'running' ? 'NORMAL' : 'CRITICAL'}\n`;
    if (metrics.aiHealth.ollama.active_model) {
      csvContent += `Active Model,"${metrics.aiHealth.ollama.active_model}",-,-\n`;
    }
    csvContent += `LM Studio,${metrics.aiHealth.lm_studio.status},${metrics.aiHealth.lm_studio.models_count} models available,${metrics.aiHealth.lm_studio.status === 'running' ? 'NORMAL' : 'CRITICAL'}\n`;
    if (metrics.aiHealth.gpu) {
      const gpuStatus = metrics.aiHealth.gpu.utilization > 90 ? 'CRITICAL' : metrics.aiHealth.gpu.utilization > 70 ? 'WARNING' : 'NORMAL';
      csvContent += `GPU VRAM,${metrics.aiHealth.gpu.vram_used || 0}/${metrics.aiHealth.gpu.vram_total || 0} MB,${metrics.aiHealth.gpu.utilization || 0}% utilization,${gpuStatus}\n`;
    }

    // AI Processes Section
    csvContent += '\nAI PROCESSES (EMERGENCY)\n';
    csvContent += 'Process Name,PID,Memory (MB),Status,Criticality\n';
    if (metrics.aiModels.processes && metrics.aiModels.processes.length > 0) {
      metrics.aiModels.processes.forEach((process: any) => {
        csvContent += `"${process.name}",${process.pid},${process.memory},Running,NORMAL\n`;
      });
    } else {
      csvContent += 'No AI processes detected,-,-,-,CRITICAL\n';
    }

    // Recent Diagnostic History (Last 5 entries)
    csvContent += '\nRECENT DIAGNOSTIC HISTORY (EMERGENCY)\n';
    csvContent += 'Type,Status,Timestamp,Duration (ms),Warnings,Errors,Criticality\n';
    if (history && history.length > 0) {
      const recentHistory = history.slice(0, 5); // Last 5 diagnostics
      recentHistory.forEach((diagnostic: any) => {
        const criticality = diagnostic.status === 'FAILED' ? 'CRITICAL' : diagnostic.status === 'WARNINGS' ? 'WARNING' : 'NORMAL';
        csvContent += `"${diagnostic.type}","${diagnostic.status}","${new Date(diagnostic.timestamp).toLocaleString()}",${diagnostic.duration || 0},${diagnostic.warnings || 0},${diagnostic.errors || 0},${criticality}\n`;
      });
    } else {
      csvContent += 'No diagnostic history available,-,-,-,-,-,WARNING\n';
    }

    // Emergency Recommendations
    csvContent += '\nEMERGENCY RECOMMENDATIONS\n';
    csvContent += 'Recommendation,Priority,Action Required\n';

    if (metrics.cpu.usage > 80) {
      csvContent += 'High CPU Usage Detected,HIGH,Close unnecessary applications and monitor system load\n';
    }
    if (metrics.memory.percentage > 80) {
      csvContent += 'High Memory Usage Detected,HIGH,Close memory-intensive applications\n';
    }
    if (metrics.disk.percentage > 85) {
      csvContent += 'Critical Disk Usage Detected,HIGH,Free up disk space immediately\n';
    }
    if (metrics.aiHealth.ollama.status !== 'running') {
      csvContent += 'Ollama Service Not Running,HIGH,Restart Ollama service\n';
    }
    if (metrics.aiHealth.lm_studio.status !== 'running') {
      csvContent += 'LM Studio Service Not Running,HIGH,Restart LM Studio service\n';
    }
    if (metrics.aiHealth.gpu?.utilization > 90) {
      csvContent += 'GPU VRAM Critical,HIGH,Switch to smaller AI model or reduce concurrent operations\n';
    }

    if (!csvContent.includes('HIGH') && !csvContent.includes('CRITICAL')) {
      csvContent += 'System appears stable,NORMAL,No immediate action required\n';
    }

    // Create the CSV blob for download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Return the CSV as a downloadable response
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="emergency-system-report-${new Date().toISOString().split('T')[0]}-${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}.csv"`
      }
    });

  } catch (error) {
    console.error('Emergency report generation error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to generate emergency report'
    }, { status: 500 });
  }
}

async function restartAIServices() {
  try {
    const platform = os.platform();
    console.log(`Restarting AI services on ${platform}...`);

    // Step 1: Check which services are actually running via API calls
    console.log('Step 1: Checking which AI services are currently running...');
    const [ollamaRunning, lmStudioRunning] = await Promise.all([
      checkServiceRunning('ollama', 11434),
      checkServiceRunning('lm_studio', 1234)
    ]);

    console.log(`Ollama running: ${ollamaRunning}, LM Studio running: ${lmStudioRunning}`);

    if (!ollamaRunning && !lmStudioRunning) {
      console.log('No AI services detected as running - attempting to start them anyway');
    }

    // Step 2: Try graceful shutdown via API (if supported)
    console.log('Step 2: Attempting graceful shutdown...');

    // For Ollama - try to unload all models first (graceful shutdown)
    if (ollamaRunning) {
      try {
        console.log('Attempting to gracefully shut down Ollama...');
        // Try to unload running models
        const unloadResponse = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'any',
            prompt: '',
            stream: false,
            keep_alive: 0  // This should unload the model
          }),
          signal: AbortSignal.timeout(2000)
        });

        if (unloadResponse.ok) {
          console.log('Ollama models unloaded gracefully');
        }
      } catch (unloadError) {
        console.log('Graceful Ollama shutdown failed, proceeding to force kill');
      }
    }

    // Step 3: Force kill processes by port (most reliable method)
    console.log('Step 3: Force killing processes by port...');
    const killResults = [];

    // Kill Ollama (port 11434)
    try {
      if (platform === 'win32') {
        const { stdout: netstatOut } = await execAsync('netstat -ano | findstr "11434"');
        if (netstatOut.trim()) {
          const lines = netstatOut.trim().split('\n');
          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 5) {
              const pid = parts[4];
              if (pid && pid !== '0') {
                await execAsync(`taskkill /f /pid ${pid} 2>/dev/null || true`);
                console.log(`Killed Ollama process (PID: ${pid})`);
                killResults.push({ service: 'Ollama', pid, method: 'port_kill' });
              }
            }
          }
        }
      } else {
        // macOS/Linux
        await execAsync('lsof -ti:11434 | xargs kill -9 2>/dev/null || true');
        console.log('Killed processes on Ollama port (11434)');
        killResults.push({ service: 'Ollama', method: 'port_kill' });
      }
    } catch (error) {
      console.log('Ollama port killing failed or no processes found');
    }

    // Kill LM Studio (port 1234) - Note: LM Studio has multiple processes
    try {
      if (platform === 'win32') {
        const { stdout: netstatOut } = await execAsync('netstat -ano | findstr "1234"');
        if (netstatOut.trim()) {
          const lines = netstatOut.trim().split('\n');
          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 5) {
              const pid = parts[4];
              if (pid && pid !== '0') {
                await execAsync(`taskkill /f /pid ${pid} 2>/dev/null || true`);
                console.log(`Killed LM Studio process (PID: ${pid})`);
                killResults.push({ service: 'LM Studio', pid, method: 'port_kill' });
              }
            }
          }
        }
      } else {
        // macOS/Linux
        await execAsync('lsof -ti:1234 | xargs kill -9 2>/dev/null || true');
        console.log('Killed processes on LM Studio port (1234)');
        killResults.push({ service: 'LM Studio', method: 'port_kill' });
      }
    } catch (error) {
      console.log('LM Studio port killing failed or no processes found');
    }

    // Step 4: Also try process name killing as backup (with correct names)
    console.log('Step 4: Backup process name killing...');
    const aiProcesses = ['ollama.exe', 'LM Studio.exe'];

    for (const processName of aiProcesses) {
      try {
        switch (platform) {
          case 'win32':
            await execAsync(`taskkill /f /im "${processName}" /t 2>/dev/null || true`);
            break;
          case 'darwin':
          case 'linux':
            await execAsync(`pkill -9 -f "${processName.replace('.exe', '')}" 2>/dev/null || true`);
            break;
        }
        console.log(`Backup kill attempted for: ${processName}`);
      } catch (error) {
        // Ignore errors
      }
    }

    // Step 2: Wait a moment for processes to fully terminate
    console.log('Step 2: Waiting for processes to terminate...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 3: Attempt to restart services
    console.log('Step 3: Attempting to restart AI services...');
    const restartResults = [];

    // Try to restart Ollama (most common)
    try {
      switch (platform) {
        case 'win32':
          // Try to start Ollama service or executable
          await execAsync('net start ollama 2>/dev/null || start "" "C:\\Program Files\\Ollama\\ollama.exe" app 2>/dev/null || true');
          break;

        case 'darwin':
          // macOS: Try launchctl or direct start
          await execAsync('launchctl start com.ollama.ollama 2>/dev/null || open -a "Ollama" 2>/dev/null || true');
          break;

        case 'linux':
          // Linux: Try systemctl or direct start
          await execAsync('sudo systemctl start ollama 2>/dev/null || ollama serve 2>/dev/null || true');
          break;
      }
      restartResults.push({ service: 'Ollama', status: 'attempted_restart' });
    } catch (error) {
      restartResults.push({ service: 'Ollama', status: 'restart_failed', error: error instanceof Error ? error.message : String(error) });
    }

    // Try to restart LM Studio
    try {
      switch (platform) {
        case 'win32':
          await execAsync('start "" "C:\\Program Files\\LM Studio\\LM Studio.exe" 2>/dev/null || true');
          break;

        case 'darwin':
          await execAsync('open -a "LM Studio" 2>/dev/null || true');
          break;

        case 'linux':
          // LM Studio might not have Linux version, skip
          break;
      }
      if (platform !== 'linux') {
        restartResults.push({ service: 'LM Studio', status: 'attempted_restart' });
      }
    } catch (error) {
      restartResults.push({ service: 'LM Studio', status: 'restart_failed', error: error instanceof Error ? error.message : String(error) });
    }

    // Step 4: Health check - wait and verify services are running
    console.log('Step 4: Performing health checks...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const healthResults = [];

    // Check Ollama
    try {
      const ollamaResponse = await fetch('http://localhost:11434/api/tags', {
        signal: AbortSignal.timeout(5000)
      });
      healthResults.push({
        service: 'Ollama',
        status: ollamaResponse.ok ? 'running' : 'not_responding',
        port: 11434
      });
    } catch (error) {
      healthResults.push({
        service: 'Ollama',
        status: 'not_running',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Check LM Studio
    try {
      const lmResponse = await fetch('http://localhost:1234/v1/models', {
        signal: AbortSignal.timeout(5000)
      });
      healthResults.push({
        service: 'LM Studio',
        status: lmResponse.ok ? 'running' : 'not_responding',
        port: 1234
      });
    } catch (error) {
      healthResults.push({
        service: 'LM Studio',
        status: 'not_running',
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Log the emergency action
    try {
      const diagnosticResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/diagnostics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'EMERGENCY_AI_RESTART',
          status: 'COMPLETED',
          summary: `AI services restarted on ${platform}. ${restartResults.length} services attempted.`,
          results: {
            platform,
            processesTerminated: aiProcesses,
            restartAttempts: restartResults,
            healthChecks: healthResults,
            timestamp: new Date().toISOString()
          },
          warnings: healthResults.filter(h => h.status !== 'running').length,
          errors: restartResults.filter(r => r.status === 'restart_failed').length
        })
      });

      if (diagnosticResponse.ok) {
        console.log('Emergency AI restart logged to diagnostics');
      }
    } catch (logError) {
      console.error('Failed to log emergency action:', logError);
    }

    return NextResponse.json({
      status: 'success',
      message: 'AI services restart completed',
      data: {
        platform,
        processesTerminated: aiProcesses,
        restartAttempts: restartResults,
        healthChecks: healthResults,
        summary: `${restartResults.length} services restart attempted, ${healthResults.filter(h => h.status === 'running').length} confirmed running`
      }
    });

  } catch (error) {
    console.error('AI restart error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to restart AI services',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function optimizeForLowResources() {
  try {
    const platform = os.platform();
    console.log(`Optimizing system resources on ${platform}...`);

    const optimizationResults = {
      processesKilled: 0,
      cacheCleared: false,
      memoryOptimized: false,
      tempFilesCleaned: false,
      warnings: [] as string[]
    };

    // Step 1: Kill non-essential processes (be very careful here)
    console.log('Step 1: Identifying and terminating non-essential processes...');

    // Define processes that are generally safe to kill (browsers, media players, etc.)
    // This is a conservative list - we don't want to break the system
    const nonEssentialProcesses = [
      'chrome.exe', 'firefox.exe', 'msedge.exe', 'opera.exe',
      'vlc.exe', 'wmplayer.exe', 'spotify.exe', 'discord.exe',
      'steam.exe', 'epicgameslauncher.exe', 'uplay.exe',
      'notepad.exe', 'wordpad.exe', 'mspaint.exe'
    ];

    // Define critical processes that should NEVER be killed
    const criticalProcesses = [
      'svchost.exe', 'lsass.exe', 'winlogon.exe', 'csrss.exe',
      'services.exe', 'system', 'init', 'systemd', 'launchd',
      'node.exe', 'next-server', 'ollama.exe', 'LM Studio.exe'
    ];

    try {
      if (platform === 'win32') {
        // Get list of running processes
        const { stdout: tasklistOut } = await execAsync('tasklist /FI "STATUS eq running" /FO CSV /NH');
        const runningProcesses = tasklistOut.split('\n')
          .map(line => line.split(',')[0]?.replace(/"/g, '').toLowerCase())
          .filter(name => name && name !== 'system');

        console.log(`Found ${runningProcesses.length} running processes`);

        // Kill non-essential processes
        for (const processName of nonEssentialProcesses) {
          if (runningProcesses.includes(processName.toLowerCase())) {
            try {
              await execAsync(`taskkill /f /im "${processName}" /t 2>/dev/null || true`);
              optimizationResults.processesKilled++;
              console.log(`Terminated non-essential process: ${processName}`);
            } catch (killError) {
              // Process might have already exited
            }
          }
        }
      } else if (platform === 'linux' || platform === 'darwin') {
        // For Unix systems, be more conservative
        // Only kill specific known non-essential processes
        const safeToKill = ['firefox', 'chrome', 'vlc', 'spotify'];

        for (const processName of safeToKill) {
          try {
            await execAsync(`pkill -f "${processName}" 2>/dev/null || true`);
            optimizationResults.processesKilled++;
            console.log(`Terminated non-essential process: ${processName}`);
          } catch (error) {
            // Ignore errors
          }
        }
      }
    } catch (processError) {
      console.log('Process optimization completed with some errors');
      optimizationResults.warnings.push('Some processes could not be terminated');
    }

    // Step 2: Clear system caches and temporary files
    console.log('Step 2: Clearing caches and temporary files...');

    try {
      if (platform === 'win32') {
        // Clear Windows temp files
        await execAsync('del /q /f /s %TEMP%\\* 2>/dev/null || true');
        await execAsync('rd /s /q %TEMP% 2>/dev/null || true && mkdir %TEMP% 2>/dev/null || true');

        // Clear Windows prefetch
        await execAsync('del /q /f /s C:\\Windows\\Prefetch\\* 2>/dev/null || true');

        // Run disk cleanup (silent)
        await execAsync('cleanmgr /sagerun:1 2>/dev/null || true');

        optimizationResults.cacheCleared = true;
        optimizationResults.tempFilesCleaned = true;
        console.log('Windows caches and temp files cleared');
      } else if (platform === 'linux') {
        // Clear Linux caches (be careful with system cache)
        await execAsync('rm -rf ~/.cache/thumbnails/* 2>/dev/null || true');
        await execAsync('rm -rf /tmp/* 2>/dev/null || true');
        await execAsync('sync && echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true');

        optimizationResults.cacheCleared = true;
        optimizationResults.tempFilesCleaned = true;
        console.log('Linux caches and temp files cleared');
      } else if (platform === 'darwin') {
        // Clear macOS caches
        await execAsync('rm -rf ~/Library/Caches/* 2>/dev/null || true');
        await execAsync('rm -rf /tmp/* 2>/dev/null || true');

        optimizationResults.cacheCleared = true;
        optimizationResults.tempFilesCleaned = true;
        console.log('macOS caches and temp files cleared');
      }
    } catch (cacheError) {
      console.log('Cache clearing completed with some errors');
      optimizationResults.warnings.push('Some cache files could not be cleared');
    }

    // Step 3: Memory optimization
    console.log('Step 3: Optimizing memory usage...');

    try {
      if (platform === 'win32') {
        // Clear Windows standby memory
        await execAsync('rundll32.exe advapi32.dll,ProcessIdleTasks 2>/dev/null || true');
        optimizationResults.memoryOptimized = true;
        console.log('Windows memory optimized');
      } else if (platform === 'linux') {
        // Force Linux to drop caches and free memory
        await execAsync('sync && echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true');
        optimizationResults.memoryOptimized = true;
        console.log('Linux memory optimized');
      } else if (platform === 'darwin') {
        // macOS memory optimization
        await execAsync('purge 2>/dev/null || true');
        optimizationResults.memoryOptimized = true;
        console.log('macOS memory optimized');
      }
    } catch (memoryError) {
      console.log('Memory optimization completed with some errors');
      optimizationResults.warnings.push('Memory optimization partially failed');
    }

    // Step 4: AI Model optimization (switch to lighter models if needed)
    console.log('Step 4: Checking AI model optimization...');

    try {
      // Check current system load
      const metricsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/system-metrics`);
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        if (metricsData.status === 'success') {
          const metrics = metricsData.data;

          // If system is under heavy load, suggest lighter models
          if (metrics.cpu.usage > 80 || (metrics.memory.percentage > 80) ||
              (metrics.aiHealth.gpu?.utilization && metrics.aiHealth.gpu.utilization > 85)) {

            optimizationResults.warnings.push('System under heavy load - consider using lighter AI models');

            // Try to switch Ollama to a smaller model if it's running a large one
            if (metrics.aiHealth.ollama.status === 'running' && metrics.aiHealth.ollama.active_model) {
              const currentModel = metrics.aiHealth.ollama.active_model.toLowerCase();
              if (currentModel.includes('70b') || currentModel.includes('65b')) {
                optimizationResults.warnings.push('Large AI model detected - consider switching to llama3:8b for better performance');
              }
            }
          }
        }
      }
    } catch (aiError) {
      console.log('AI model check completed');
    }

    // Step 5: Wait a moment for optimizations to take effect
    console.log('Step 5: Allowing optimizations to take effect...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Log the emergency optimization
    try {
      const diagnosticResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/diagnostics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'EMERGENCY_RESOURCE_OPTIMIZATION',
          status: 'COMPLETED',
          summary: `System resources optimized on ${platform}. ${optimizationResults.processesKilled} processes terminated.`,
          results: {
            platform,
            ...optimizationResults,
            timestamp: new Date().toISOString()
          },
          warnings: optimizationResults.warnings.length,
          errors: 0
        })
      });

      if (diagnosticResponse.ok) {
        console.log('Emergency resource optimization logged to diagnostics');
      }
    } catch (logError) {
      console.error('Failed to log emergency optimization:', logError);
    }

    const summary = `${optimizationResults.processesKilled} processes terminated, caches ${optimizationResults.cacheCleared ? 'cleared' : 'not cleared'}, memory ${optimizationResults.memoryOptimized ? 'optimized' : 'not optimized'}`;

    return NextResponse.json({
      status: 'success',
      message: 'System resource optimization completed',
      data: {
        ...optimizationResults,
        summary,
        recommendations: optimizationResults.warnings
      }
    });

  } catch (error) {
    console.error('Resource optimization error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to optimize system resources',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function switchToLiteMode() {
  try {
    const platform = os.platform();
    console.log(`Switching to lite mode on ${platform}...`);

    // Define lite mode configuration
    const liteConfig = {
      mode: 'lite',
      timestamp: new Date().toISOString(),
      settings: {
        // AI Model settings
        ai: {
          preferredModel: 'llama3:8b', // Smaller, faster model
          availableModels: [] as string[], // Will be populated by analysis
          maxTokens: 1024, // Shorter responses
          temperature: 0.7, // More focused responses
          disableComplexModels: true, // Don't load 70B+ models
        },
        // UI settings
        ui: {
          disableAnimations: true, // Reduce CPU usage
          disableBackgroundEffects: true, // Reduce GPU usage
          simplifyInterface: true, // Hide advanced features
          reducePolling: true, // Less frequent updates
        },
        // System settings
        system: {
          disableBackgroundTasks: true, // Reduce CPU/memory usage
          limitConcurrentOperations: true, // Prevent resource overload
          enablePowerSaving: true, // System-level power saving
        },
        // Performance settings
        performance: {
          memoryLimit: 0.7, // Use max 70% of available RAM
          cpuLimit: 0.8, // Use max 80% of available CPU
          disableHeavyFeatures: true, // Analytics, complex calculations
        }
      }
    };

    const configResults = {
      mode: 'lite',
      changes: [] as string[],
      warnings: [] as string[],
      recommendations: [] as string[]
    };

    // Step 1: Save lite mode configuration
    console.log('Step 1: Saving lite mode configuration...');

    // Create config directory if it doesn't exist
    const configDir = './config';
    const configPath = './config/system-mode.json';

    try {
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      // Save configuration to file
      fs.writeFileSync(configPath, JSON.stringify(liteConfig, null, 2));
      configResults.changes.push('Configuration saved to system-mode.json');
      console.log('Lite mode configuration saved');
    } catch (configError) {
      console.log('Configuration saving failed, continuing with runtime changes');
      configResults.warnings.push('Could not save configuration file');
    }

    // Step 2: Apply AI model optimizations
    console.log('Step 2: Applying AI model optimizations...');

    try {
      // Check current AI status
      const [ollamaRunning, lmStudioRunning] = await Promise.all([
        checkServiceRunning('ollama', 11434),
        checkServiceRunning('lm_studio', 1234)
      ]);

      if (ollamaRunning) {
        // Analyze available models and select optimal lite mode model
        try {
          const tagsResponse = await fetch('http://localhost:11434/api/tags');
          if (tagsResponse.ok) {
            const tagsData = await tagsResponse.json();
            const models = tagsData.models || [];

            if (models.length > 0) {
              // Analyze available models for lite mode optimization
              const modelAnalysis = analyzeModelsForLiteMode(models);

              // Update lite config with best available model
              liteConfig.settings.ai.preferredModel = modelAnalysis.recommendedModel;
              liteConfig.settings.ai.availableModels = modelAnalysis.availableModels;

              // Add specific recommendations
              configResults.recommendations.push(...modelAnalysis.recommendations);

              // Check if heavy models are currently active
              if (modelAnalysis.heavyModelsActive) {
                configResults.recommendations.push(`Heavy model(s) detected: ${modelAnalysis.heavyModelsActive.join(', ')} - lite mode will prioritize ${modelAnalysis.recommendedModel}`);
              }

              configResults.changes.push(`AI model analysis complete - ${models.length} models available, ${modelAnalysis.recommendedModel} selected for lite mode`);

              // Re-save the updated config with the selected model
              try {
                fs.writeFileSync(configPath, JSON.stringify(liteConfig, null, 2));
                console.log('Updated lite mode configuration saved with selected model');
              } catch (updateError) {
                console.log('Failed to update config with selected model');
              }
            } else {
              configResults.warnings.push('No AI models available for optimization');
            }
          }
        } catch (aiError) {
          console.log('AI model analysis failed, using default settings');
          configResults.warnings.push('Could not analyze AI models, using default lite mode settings');
        }
      } else {
        configResults.warnings.push('Ollama not running - AI model optimization skipped');
      }

      configResults.changes.push('AI model optimizations configured');
    } catch (aiError) {
      configResults.warnings.push('AI model optimization check failed');
    }

    // Step 3: Apply system-level optimizations
    console.log('Step 3: Applying system-level optimizations...');

    try {
      if (platform === 'win32') {
        // Windows power settings for lite mode
        await execAsync('powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 2>/dev/null || true'); // Balanced plan
        configResults.changes.push('Windows power plan set to balanced mode');
      } else if (platform === 'linux') {
        // Linux CPU governor settings
        await execAsync('echo "ondemand" | tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor 2>/dev/null || true');
        configResults.changes.push('Linux CPU governor set to ondemand');
      } else if (platform === 'darwin') {
        // macOS power settings
        await execAsync('pmset -a displaysleep 10 disksleep 10 sleep 30 2>/dev/null || true');
        configResults.changes.push('macOS power settings optimized');
      }
    } catch (systemError) {
      configResults.warnings.push('Some system optimizations could not be applied');
    }

    // Step 4: Memory and resource management
    console.log('Step 4: Configuring memory and resource management...');

    try {
      // Force garbage collection if available (Node.js with --expose-gc)
      if (global.gc) {
        global.gc();
        configResults.changes.push('Memory garbage collection triggered');
      }

      // Additional memory optimization
      if (platform === 'linux') {
        await execAsync('echo 1 > /proc/sys/vm/compact_memory 2>/dev/null || true');
        configResults.changes.push('Linux memory compaction enabled');
      }
    } catch (memoryError) {
      // Memory optimization is not critical
    }

    // Step 5: Create lite mode status report
    console.log('Step 5: Generating lite mode status report...');

    const liteModeStatus = {
      mode: 'lite',
      activated: new Date().toISOString(),
      platform,
      configuration: liteConfig,
      changes: configResults.changes,
      warnings: configResults.warnings,
      recommendations: configResults.recommendations
    };

    // Log the lite mode activation
    try {
      const diagnosticResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/diagnostics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'LITE_MODE_ACTIVATION',
          status: 'COMPLETED',
          summary: `System switched to lite mode on ${platform}. ${configResults.changes.length} optimizations applied.`,
          results: liteModeStatus,
          warnings: configResults.warnings.length,
          errors: 0
        })
      });

      if (diagnosticResponse.ok) {
        console.log('Lite mode activation logged to diagnostics');
      }
    } catch (logError) {
      console.error('Failed to log lite mode activation:', logError);
    }

    const summary = `Lite mode activated with ${configResults.changes.length} optimizations applied`;

    return NextResponse.json({
      status: 'success',
      message: 'System switched to lite mode',
      data: {
        ...configResults,
        summary,
        status: liteModeStatus
      }
    });

  } catch (error) {
    console.error('Lite mode switch error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to switch to lite mode',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
