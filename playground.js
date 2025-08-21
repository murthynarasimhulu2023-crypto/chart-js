class D3Playground {
    constructor() {
        this.codeEditor = document.getElementById('codeEditor');
        this.output = document.getElementById('output');
        this.runBtn = document.getElementById('runBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.autoRunBtn = document.getElementById('autoRunBtn');
        this.exampleSelect = document.getElementById('exampleSelect');
        this.status = document.getElementById('status');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        this.autoRun = false;
        this.debounceTimer = null;
        
        this.initializeEventListeners();
        this.setupGlobalEnvironment();
        this.loadExamples();
    }
    
    initializeEventListeners() {
        this.runBtn.addEventListener('click', () => this.executeCode());
        this.clearBtn.addEventListener('click', () => this.clearOutput());
        this.autoRunBtn.addEventListener('click', () => this.toggleAutoRun());
        this.exampleSelect.addEventListener('change', (e) => this.loadExample(e.target.value));
        
        this.codeEditor.addEventListener('input', () => {
            if (this.autoRun) {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => this.executeCode(), 1000);
            }
        });
        
        // Keyboard shortcuts
        this.codeEditor.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.executeCode();
            }
            
            // Tab support
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.codeEditor.selectionStart;
                const end = this.codeEditor.selectionEnd;
                this.codeEditor.value = this.codeEditor.value.substring(0, start) + '  ' + this.codeEditor.value.substring(end);
                this.codeEditor.selectionStart = this.codeEditor.selectionEnd = start + 2;
            }
        });
    }
    
    setupGlobalEnvironment() {
        // Create global utilities and data generators
        window.DOM = {
            uid: (name) => {
                const id = `${name}-${Math.random().toString(36).substr(2, 9)}`;
                return { id, href: `#${id}` };
            },
            context2d: (width, height, dpi = window.devicePixelRatio || 1) => {
                const canvas = document.createElement('canvas');
                canvas.width = width * dpi;
                canvas.height = height * dpi;
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
                const context = canvas.getContext('2d');
                context.scale(dpi, dpi);
                return context;
            }
        };
        
        // Observable-style generators
        window.Generators = {
            input: (element) => {
                const input = document.createElement('input');
                input.type = 'range';
                input.min = 0;
                input.max = 100;
                input.value = 50;
                return input;
            }
        };
        
        // Common data generators
        window.generateData = {
            random: (n = 100) => Array.from({length: n}, () => Math.random()),
            
            timeSeries: (n = 100, start = new Date(2020, 0, 1)) => {
                return Array.from({length: n}, (_, i) => ({
                    date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000),
                    value: Math.random() * 100 + Math.sin(i / 10) * 20
                }));
            },
            
            scatter: (n = 100) => {
                return Array.from({length: n}, () => ({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    category: Math.floor(Math.random() * 5)
                }));
            },
            
            hierarchy: (depth = 3, children = 3) => {
                const createNode = (level, name = 'root') => {
                    if (level <= 0) return { name, value: Math.random() * 100 };
                    return {
                        name,
                        children: Array.from({length: children}, (_, i) => 
                            createNode(level - 1, `${name}-${i}`)
                        )
                    };
                };
                return createNode(depth);
            },
            
            network: (nodes = 20, links = 30) => {
                const nodeData = Array.from({length: nodes}, (_, i) => ({
                    id: i,
                    group: Math.floor(Math.random() * 5)
                }));
                
                const linkData = Array.from({length: links}, () => ({
                    source: Math.floor(Math.random() * nodes),
                    target: Math.floor(Math.random() * nodes),
                    value: Math.random()
                }));
                
                return { nodes: nodeData, links: linkData };
            }
        };
        
        // Sample datasets
        window.sampleData = {
            alphabet: [
                {letter: 'A', frequency: 0.08167},
                {letter: 'B', frequency: 0.01492},
                {letter: 'C', frequency: 0.02782},
                {letter: 'D', frequency: 0.04253},
                {letter: 'E', frequency: 0.12702},
                {letter: 'F', frequency: 0.02288},
                {letter: 'G', frequency: 0.02015},
                {letter: 'H', frequency: 0.06094},
                {letter: 'I', frequency: 0.06966},
                {letter: 'J', frequency: 0.00153},
                {letter: 'K', frequency: 0.00772},
                {letter: 'L', frequency: 0.04025},
                {letter: 'M', frequency: 0.02406},
                {letter: 'N', frequency: 0.06749},
                {letter: 'O', frequency: 0.07507},
                {letter: 'P', frequency: 0.01929},
                {letter: 'Q', frequency: 0.00095},
                {letter: 'R', frequency: 0.05987},
                {letter: 'S', frequency: 0.06327},
                {letter: 'T', frequency: 0.09056},
                {letter: 'U', frequency: 0.02758},
                {letter: 'V', frequency: 0.00978},
                {letter: 'W', frequency: 0.02360},
                {letter: 'X', frequency: 0.00150},
                {letter: 'Y', frequency: 0.01974},
                {letter: 'Z', frequency: 0.00074}
            ],
            
            stocks: generateData.timeSeries(252, new Date(2023, 0, 1)).map(d => ({
                date: d.date,
                close: d.value + 100
            }))
        };
        
        // Utility functions
        window.Legend = (color, {
            title,
            tickSize = 6,
            width = 320,
            height = 44 + tickSize,
            marginTop = 18,
            marginRight = 0,
            marginBottom = 16 + tickSize,
            marginLeft = 0,
            ticks = width / 64,
            tickFormat,
            tickValues
        } = {}) => {
            const svg = d3.create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .style("overflow", "visible")
                .style("display", "block");
                
            let x;
            
            if (color.interpolate) {
                x = Object.assign(color.copy()
                    .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
                    {range() { return [marginLeft, width - marginRight]; }});
                    
                svg.append("image")
                    .attr("x", marginLeft)
                    .attr("y", marginTop)
                    .attr("width", width - marginLeft - marginRight)
                    .attr("height", height - marginTop - marginBottom)
                    .attr("preserveAspectRatio", "none")
                    .attr("xlink:href", ramp(color.interpolator()).toDataURL());
            }
            
            if (title) {
                svg.append("text")
                    .attr("x", marginLeft)
                    .attr("y", marginTop - 6)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .attr("font-weight", "bold")
                    .text(title);
            }
            
            return svg.node();
        };
        
        function ramp(color, n = 256) {
            const canvas = document.createElement('canvas');
            canvas.width = n;
            canvas.height = 1;
            const context = canvas.getContext('2d');
            for (let i = 0; i < n; ++i) {
                context.fillStyle = color(i / (n - 1));
                context.fillRect(i, 0, 1, 1);
            }
            return canvas;
        }
        
        // Auto-sizing for Observable-style width
        window.width = Math.min(928, window.innerWidth - 40);
        
        // File attachment mock
        window.FileAttachment = (name) => ({
            text: () => Promise.resolve(''),
            json: () => Promise.resolve({}),
            csv: () => Promise.resolve([])
        });
    }
    
    loadExamples() {
        // List of available examples based on your files
        const examples = [
            'animated-treemap',
            'arc-diagram',
            'area-chart',
            'bar-chart',
            'bubble-chart',
            'calendar',
            'candlestick-chart',
            'chord-diagram',
            'choropleth',
            'connected-scatterplot',
            'density-contours',
            'donut-chart',
            'force-directed-graph',
            'hexbin',
            'histogram',
            'horizon-chart',
            'line-chart',
            'multi-line-chart',
            'pack',
            'parallel-coordinates',
            'pie-chart',
            'radial-area-chart',
            'sankey',
            'scatterplot',
            'stacked-area-chart',
            'stacked-bar-chart',
            'streamgraph',
            'sunburst',
            'treemap',
            'violin-plot',
            'world-map'
        ];
        
        examples.forEach(example => {
            const option = document.createElement('option');
            option.value = example;
            option.textContent = example.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            this.exampleSelect.appendChild(option);
        });
    }
    
    async loadExample(exampleName) {
        if (!exampleName) return;
        
        this.showLoading(true);
        this.setStatus('Loading example...');
        
        try {
            // Try to load the example from your files
            const response = await fetch(`${exampleName}.js`);
            if (response.ok) {
                const code = await response.text();
                this.codeEditor.value = code;
                this.setStatus('Example loaded');
                if (this.autoRun) {
                    setTimeout(() => this.executeCode(), 500);
                }
            } else {
                // Fallback to a simple example
                this.loadFallbackExample(exampleName);
            }
        } catch (error) {
            this.loadFallbackExample(exampleName);
        } finally {
            this.showLoading(false);
        }
    }
    
    loadFallbackExample(exampleName) {
        const examples = {
            'bar-chart': `// Simple Bar Chart
const data = sampleData.alphabet.slice(0, 10);

const margin = {top: 20, right: 30, bottom: 40, left: 40};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#output')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

const g = svg.append('g')
  .attr('transform', \`translate(\${margin.left},\${margin.top})\`);

const x = d3.scaleBand()
  .domain(data.map(d => d.letter))
  .range([0, width])
  .padding(0.1);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.frequency)])
  .range([height, 0]);

g.selectAll('.bar')
  .data(data)
  .enter().append('rect')
  .attr('class', 'bar')
  .attr('x', d => x(d.letter))
  .attr('y', d => y(d.frequency))
  .attr('width', x.bandwidth())
  .attr('height', d => height - y(d.frequency))
  .attr('fill', 'steelblue');

g.append('g')
  .attr('transform', \`translate(0,\${height})\`)
  .call(d3.axisBottom(x));

g.append('g')
  .call(d3.axisLeft(y));`,

            'line-chart': `// Simple Line Chart
const data = generateData.timeSeries(50);

const margin = {top: 20, right: 30, bottom: 40, left: 50};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#output')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

const g = svg.append('g')
  .attr('transform', \`translate(\${margin.left},\${margin.top})\`);

const x = d3.scaleTime()
  .domain(d3.extent(data, d => d.date))
  .range([0, width]);

const y = d3.scaleLinear()
  .domain(d3.extent(data, d => d.value))
  .range([height, 0]);

const line = d3.line()
  .x(d => x(d.date))
  .y(d => y(d.value));

g.append('path')
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke', 'steelblue')
  .attr('stroke-width', 2)
  .attr('d', line);

g.append('g')
  .attr('transform', \`translate(0,\${height})\`)
  .call(d3.axisBottom(x));

g.append('g')
  .call(d3.axisLeft(y));`,

            'scatterplot': `// Simple Scatterplot
const data = generateData.scatter(100);

const margin = {top: 20, right: 30, bottom: 40, left: 40};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#output')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

const g = svg.append('g')
  .attr('transform', \`translate(\${margin.left},\${margin.top})\`);

const x = d3.scaleLinear()
  .domain([0, 100])
  .range([0, width]);

const y = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);

const color = d3.scaleOrdinal(d3.schemeCategory10);

g.selectAll('.dot')
  .data(data)
  .enter().append('circle')
  .attr('class', 'dot')
  .attr('cx', d => x(d.x))
  .attr('cy', d => y(d.y))
  .attr('r', 4)
  .attr('fill', d => color(d.category));

g.append('g')
  .attr('transform', \`translate(0,\${height})\`)
  .call(d3.axisBottom(x));

g.append('g')
  .call(d3.axisLeft(y));`
        };
        
        const code = examples[exampleName] || examples['bar-chart'];
        this.codeEditor.value = code;
        this.setStatus('Fallback example loaded');
    }
    
    executeCode() {
        this.clearOutput();
        this.setStatus('Executing...');
        
        const code = this.codeEditor.value.trim();
        if (!code) {
            this.setStatus('Ready');
            return;
        }
        
        try {
            // Create a new function scope to execute the code
            const executeFunction = new Function('d3', 'topojson', 'DOM', 'Generators', 'generateData', 'sampleData', 'Legend', 'width', 'FileAttachment', `
                try {
                    ${code}
                } catch (error) {
                    throw error;
                }
            `);
            
            const result = executeFunction(
                d3, 
                typeof topojson !== 'undefined' ? topojson : {}, 
                DOM, 
                Generators, 
                generateData, 
                sampleData, 
                Legend, 
                width,
                FileAttachment
            );
            
            // Handle different types of results
            if (result && result.then) {
                // Handle promises
                result.then(resolved => {
                    if (resolved && resolved.nodeType) {
                        this.output.appendChild(resolved);
                    }
                }).catch(error => {
                    this.showError(error);
                });
            } else if (result && result.nodeType) {
                // Handle DOM nodes
                this.output.appendChild(result);
            }
            
            this.setStatus('Executed successfully');
            this.showSuccess('Code executed successfully!');
            
        } catch (error) {
            this.showError(error);
            this.setStatus('Error');
        }
    }
    
    clearOutput() {
        this.output.innerHTML = '';
    }
    
    showError(error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = error.message || error.toString();
        this.output.appendChild(errorDiv);
    }
    
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.textContent = message;
        this.output.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }
    
    toggleAutoRun() {
        this.autoRun = !this.autoRun;
        this.autoRunBtn.textContent = this.autoRun ? 'Auto Run: ON' : 'Auto Run: OFF';
        this.autoRunBtn.className = this.autoRun ? 'btn btn-success' : 'btn btn-secondary';
        
        if (this.autoRun && this.codeEditor.value.trim()) {
            this.executeCode();
        }
    }
    
    setStatus(message) {
        this.status.textContent = message;
    }
    
    showLoading(show) {
        this.loadingIndicator.style.display = show ? 'inline-block' : 'none';
    }
}

// Initialize the playground when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new D3Playground();
});