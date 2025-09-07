import React, { useState } from 'react';
import { Search, TrendingUp, BarChart3, AlertCircle, Loader2, Table, FileText, Code } from 'lucide-react';

const CropPricesDashboard = () => {
  const [apiKey, setApiKey] = useState("AIzaSyCVjwDKLp5Qj7OvKL53Cfh3H-fFIO0jemY");
  const [crop, setCrop] = useState('wheat');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [htmlCharts, setHtmlCharts] = useState([]);
  const [htmlTables, setHtmlTables] = useState([]);

  // Enhanced function to extract HTML content from Gemini response
  const extractHtmlContent = (content) => {
    const charts = [];
    const tables = [];
    
    // Chart patterns (more comprehensive)
    const chartPatterns = [
      // Complete HTML documents with charts
      /<!DOCTYPE html>[\s\S]*?<\/html>/gi,
      // Plotly charts (specific pattern)
      /<div[^>]*id[^>]*plotly[^>]*>[\s\S]*?<script[\s\S]*?Plotly\.newPlot[\s\S]*?<\/script>/gi,
      // Chart.js patterns
      /<canvas[^>]*>[\s\S]*?<\/canvas>[\s\S]*?<script[\s\S]*?Chart[\s\S]*?<\/script>/gi,
      // D3.js patterns
      /<div[^>]*>[\s\S]*?<script[\s\S]*?d3\.[\s\S]*?<\/script>[\s\S]*?<\/div>/gi,
      // SVG charts
      /<svg[\s\S]*?<\/svg>/gi,
      // Generic chart containers with scripts
      /<div[^>]*(?:chart|graph|plot|visualization)[^>]*>[\s\S]*?<script[\s\S]*?<\/script>[\s\S]*?<\/div>/gi,
      // Script-based visualizations
      /<script[\s\S]*?(?:Chart|Plotly|d3|visualization)[\s\S]*?<\/script>/gi
    ];

    // Table patterns
    const tablePatterns = [
      // HTML tables with comprehensive content
      /<table[\s\S]*?<\/table>/gi,
      // Tables with surrounding divs
      /<div[^>]*(?:table|data)[^>]*>[\s\S]*?<table[\s\S]*?<\/table>[\s\S]*?<\/div>/gi
    ];

    // Extract charts
    chartPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach((match, matchIndex) => {
          charts.push({
            id: `chart-${index}-${matchIndex}-${Math.random().toString(36).substr(2, 9)}`,
            html: match,
            type: getChartType(match),
            size: match.length
          });
        });
      }
    });

    // Extract tables
    tablePatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach((match, matchIndex) => {
          // Avoid duplicating tables that might be inside charts
          const isPartOfChart = charts.some(chart => chart.html.includes(match));
          if (!isPartOfChart) {
            tables.push({
              id: `table-${index}-${matchIndex}-${Math.random().toString(36).substr(2, 9)}`,
              html: match,
              type: getTableType(match),
              rowCount: (match.match(/<tr/gi) || []).length
            });
          }
        });
      }
    });

    return { charts, tables };
  };

  // Determine chart type based on HTML content
  const getChartType = (html) => {
    const lowerHtml = html.toLowerCase();
    if (lowerHtml.includes('plotly.newplot') || lowerHtml.includes('plotly.js')) return 'Plotly.js Chart';
    if (lowerHtml.includes('chart.js') || lowerHtml.includes('new chart(')) return 'Chart.js';
    if (lowerHtml.includes('d3.') || lowerHtml.includes('d3js')) return 'D3.js Visualization';
    if (lowerHtml.includes('<svg')) return 'SVG Chart';
    if (lowerHtml.includes('<canvas')) return 'Canvas Chart';
    if (lowerHtml.includes('<!doctype')) return 'Complete HTML Page';
    if (lowerHtml.includes('visualization') || lowerHtml.includes('chart')) return 'Interactive Chart';
    return 'HTML Visualization';
  };

  // Determine table type
  const getTableType = (html) => {
    const lowerHtml = html.toLowerCase();
    const rowCount = (html.match(/<tr/gi) || []).length;
    if (lowerHtml.includes('price') || lowerHtml.includes('cost')) return `Price Data Table (${rowCount} rows)`;
    if (lowerHtml.includes('state') || lowerHtml.includes('region')) return `Regional Data Table (${rowCount} rows)`;
    if (lowerHtml.includes('trend') || lowerHtml.includes('forecast')) return `Trend Analysis Table (${rowCount} rows)`;
    return `Data Table (${rowCount} rows)`;
  };

  // Clean markdown content by removing extracted HTML
  const cleanMarkdownContent = (content, charts, tables) => {
    let cleanContent = content;
    
    // Remove charts
    charts.forEach(chart => {
      cleanContent = cleanContent.replace(chart.html, '');
    });
    
    // Remove tables
    tables.forEach(table => {
      cleanContent = cleanContent.replace(table.html, '');
    });
    
    // Clean up extra whitespace and markdown artifacts
    cleanContent = cleanContent
      .replace(/```html[\s\S]*?```/gi, '') // Remove html code blocks
      .replace(/```[\s\S]*?```/gi, '') // Remove other code blocks that might contain HTML
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
      .trim();
    
    return cleanContent;
  };

  const fetchCropData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const prompt = `Provide comprehensive crop price analysis for ${crop} in India with interactive visualizations and data tables. Include:

## 1. State-wise Price Comparison Table
Create an HTML table comparing ${crop} prices across all major Indian states. Include columns for:
- State Name
- Current Price (₹/quintal)
- Previous Month Price
- Price Change (%)
- Market Status

## 2. Interactive Price Chart
Create a complete HTML visualization using Plotly.js CDN showing:
- Monthly price trends for the last 12 months
- State-wise price comparison
- Make it interactive with hover effects
- Use this CDN: https://cdn.plot.ly/plotly-latest.min.js

## 3. Market Analysis
- Current market conditions
- Price factors and drivers
- Regional variations
- Seasonal patterns
- Future outlook

## 4. Supply Chain Data Table  
Create another HTML table showing:
- Major producing states
- Production volumes
- Transportation costs
- Market arrival data

Format: Provide complete, self-contained HTML for tables and charts with inline CSS styling. Make tables responsive and visually appealing with proper borders, colors, and formatting.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192, // Increased for more content
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          throw new Error('Invalid request. Please check your API key and try again.');
        } else if (response.status === 403) {
          throw new Error('API key is invalid or doesn\'t have permission. Please verify your Gemini API key.');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please check your internet connection.');
        } else {
          throw new Error(`API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
        }
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated. The content may have been filtered.');
      }

      const content = data.candidates[0]?.content?.parts?.[0]?.text || '';
      
      if (!content) {
        throw new Error('Empty response received from API');
      }

      // Extract HTML content
      const { charts, tables } = extractHtmlContent(content);
      console.log('Extracted charts:', charts.length, 'tables:', tables.length);
      
      setHtmlCharts(charts);
      setHtmlTables(tables);
      
      // Clean markdown content
      const cleanContent = cleanMarkdownContent(content, charts, tables);
      setMarkdownContent(cleanContent);

      // Show sample data if no HTML content found
      if (charts.length === 0 && tables.length === 0) {
        const sampleChart = generateSamplePlotlyChart(crop);
        const sampleTable = generateSampleTable(crop);
        setHtmlCharts([sampleChart]);
        setHtmlTables([sampleTable]);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch crop data. Please check your API key and internet connection.');
      
      // Show sample data on error
      const sampleChart = generateSamplePlotlyChart(crop);
      const sampleTable = generateSampleTable(crop);
      setHtmlCharts([sampleChart]);
      setHtmlTables([sampleTable]);
      setMarkdownContent(generateSampleMarkdown(crop));
    } finally {
      setLoading(false);
    }
  };

  // Generate sample Plotly chart
  const generateSamplePlotlyChart = (cropName) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const prices = months.map(() => Math.floor(Math.random() * 500 + 2000));
    
    return {
      id: 'sample-plotly-chart',
      html: `
        <div style="width: 100%; height: 400px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <h3 style="text-align: center; color: #333; margin-bottom: 20px;">
            ${cropName.charAt(0).toUpperCase() + cropName.slice(1)} Price Trends (₹/Quintal)
          </h3>
          <div id="plotly-chart-${cropName}" style="width: 100%; height: 350px;"></div>
        </div>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        <script>
          const trace = {
            x: ${JSON.stringify(months)},
            y: ${JSON.stringify(prices)},
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: '#2E8B57', size: 8 },
            line: { color: '#2E8B57', width: 3 },
            name: '${cropName} Prices'
          };
          
          const layout = {
            title: '',
            xaxis: { title: 'Month' },
            yaxis: { title: 'Price (₹/Quintal)' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Arial, sans-serif' }
          };
          
          Plotly.newPlot('plotly-chart-${cropName}', [trace], layout, {responsive: true});
        </script>
      `,
      type: 'Plotly.js Interactive Chart',
      size: 1500
    };
  };

  // Generate sample table
  const generateSampleTable = (cropName) => {
    const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat'];
    const tableRows = states.map(state => {
      const currentPrice = Math.floor(Math.random() * 500 + 2000);
      const previousPrice = Math.floor(Math.random() * 500 + 2000);
      const change = ((currentPrice - previousPrice) / previousPrice * 100).toFixed(1);
      const status = parseFloat(change) > 0 ? 'Rising' : 'Declining';
      
      return `
        <tr style="border-bottom: 1px solid #e1e5e9;">
          <td style="padding: 12px; font-weight: 500;">${state}</td>
          <td style="padding: 12px; text-align: right;">₹${currentPrice}</td>
          <td style="padding: 12px; text-align: right;">₹${previousPrice}</td>
          <td style="padding: 12px; text-align: right; color: ${parseFloat(change) > 0 ? '#dc3545' : '#28a745'};">
            ${change > 0 ? '+' : ''}${change}%
          </td>
          <td style="padding: 12px;">
            <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; 
                         background: ${parseFloat(change) > 0 ? '#f8d7da' : '#d4edda'}; 
                         color: ${parseFloat(change) > 0 ? '#721c24' : '#155724'};">
              ${status}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    return {
      id: 'sample-price-table',
      html: `
        <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px; color: white;">
            <h3 style="margin: 0; font-size: 18px;">
              ${cropName.charAt(0).toUpperCase() + cropName.slice(1)} Prices Across States
            </h3>
          </div>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
              <thead>
                <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #495057;">State</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #495057;">Current Price</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #495057;">Previous Price</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #495057;">Change</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #495057;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
          <div style="padding: 12px; background: #f8f9fa; text-align: center; color: #6c757d; font-size: 12px;">
            Sample data for demonstration • Last updated: ${new Date().toLocaleDateString()}
          </div>
        </div>
      `,
      type: 'Regional Price Comparison Table (6 rows)',
      rowCount: 6
    };
  };

  // Generate sample markdown
  const generateSampleMarkdown = (cropName) => {
    return `# ${cropName.charAt(0).toUpperCase() + cropName.slice(1)} Market Analysis

## Market Overview
Current market conditions show moderate volatility with seasonal patterns typical for ${cropName}. Supply chain dynamics are influenced by monsoon patterns and government procurement policies.

## Key Price Drivers
- **Weather Conditions**: Normal monsoon activity supporting crop growth
- **Government Policies**: MSP announcements affecting farmer decisions  
- **Export Demand**: International market trends impacting domestic prices
- **Storage & Logistics**: Transportation costs and storage facility availability

## Regional Variations
Price differences across states reflect local supply-demand dynamics, transportation costs, and regional market infrastructure. Northern states typically show different pricing patterns compared to southern markets.

## Market Outlook
- **Short-term (3 months)**: Stable prices with seasonal adjustments
- **Medium-term (6 months)**: Dependent on harvest quality and weather
- **Long-term**: Growth driven by population increase and dietary changes

*Note: This is sample analysis. Connect with your Gemini API key for real-time market data and interactive visualizations.*`;
  };

  // Component to safely render HTML content
  const HtmlContentRenderer = ({ content, title, type }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">{title}</h4>
            <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded">
              {type}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div 
            dangerouslySetInnerHTML={{ __html: content.html }}
            style={{ minHeight: '200px' }}
          />
        </div>
      </div>
    );
  };

  // Convert markdown to HTML
  const renderMarkdown = (markdown) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1 list-disc">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 list-disc">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br/>');
  };

  const cropOptions = [
    'wheat', 'rice', 'corn', 'soybeans', 'cotton', 'sugar', 'coffee', 'cocoa',
    'barley', 'oats', 'canola', 'sunflower', 'potato', 'tomato', 'onion', 'mustard'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌾 Smart Crop Market Intelligence
          </h1>
          <p className="text-gray-600 text-lg">
            AI-powered crop analysis with interactive charts, data tables, and market insights
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
          
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌱 Select Crop
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {cropOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={fetchCropData}
                disabled={loading || !apiKey.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Analysis...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Get Market Intelligence
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Layout */}
        {(markdownContent || htmlCharts.length > 0 || htmlTables.length > 0) && (
          <div className="space-y-8">
            
            {/* Charts Section */}
            {htmlCharts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Interactive Charts ({htmlCharts.length})
                  </h2>
                </div>
                <div className="grid lg:grid-cols-1 gap-6">
                  {htmlCharts.map((chart, index) => (
                    <HtmlContentRenderer
                      key={`chart-${chart.id}-${index}`}
                      content={chart}
                      title={`Chart ${index + 1}: ${chart.type}`}
                      type={`${(chart.size / 1000).toFixed(1)}KB`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tables Section */}
            {htmlTables.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Table className="w-6 h-6 text-green-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Data Tables ({htmlTables.length})
                  </h2>
                </div>
                <div className="space-y-6">
                  {htmlTables.map((table, index) => (
                    <HtmlContentRenderer
                      key={`table-${table.id}-${index}`}
                      content={table}
                      title={`Table ${index + 1}: ${table.type}`}
                      type={`${table.rowCount} rows`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Markdown Analysis */}
            {markdownContent && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-6 h-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Market Analysis Report</h2>
                </div>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: `<div class="mb-3">${renderMarkdown(markdownContent)}</div>` 
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Getting Started */}
        {!markdownContent && htmlCharts.length === 0 && htmlTables.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Advanced Market Intelligence Ready
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Get comprehensive crop market analysis with interactive Plotly charts, data tables, and AI insights.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold text-blue-800 mb-2">Interactive Charts</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Plotly.js visualizations</li>
                  <li>• Price trend analysis</li>
                  <li>• State-wise comparisons</li>
                  <li>• Seasonal patterns</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <Table className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h4 className="font-bold text-green-800 mb-2">Data Tables</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• State-wise pricing</li>
                  <li>• Market comparisons</li>
                  <li>• Supply chain data</li>
                  <li>• Historical records</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <FileText className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h4 className="font-bold text-purple-800 mb-2">Market Insights</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• AI-powered analysis</li>
                  <li>• Market forecasts</li>
                  <li>• Risk assessments</li>
                  <li>• Strategic recommendations</li>
                </ul>
              </div>
            </div>
            
            
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPricesDashboard;