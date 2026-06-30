                        {/* Custom Block Modal Designer */}
                        <Dialog open={isBlockOpen} onOpenChange={setIsBlockOpen}>
                            <DialogContent className="max-w-[95vw] w-[95vw] h-[92vh] flex flex-col p-0 overflow-hidden bg-[#2c2c2c] border-[#444444] rounded-xl text-neutral-200">
                                <DialogHeader className="px-6 py-3 bg-[#1e1e1e] border-b border-[#333333] flex items-center justify-between flex-row shrink-0">
                                    <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-[#0d99ff]"></div>
                                        {editingBlock ? `Edit Component: ${editingBlock.name}` : 'Create Component (Figma Mode)'}
                                    </DialogTitle>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => setIsBlockOpen(false)} className="h-7 text-xs border-[#444444] text-[#b3b3b3] hover:bg-[#333333] hover:text-white rounded px-3">Cancel</Button>
                                        <Button type="button" onClick={handleBlockSubmit} disabled={blockProcessing} className="h-7 text-xs bg-[#0d99ff] hover:bg-[#18a0fb] text-white rounded px-4 font-semibold shadow-sm">
                                            <Save className="size-3.5 mr-1" /> {editingBlock ? 'Publish Changes' : 'Publish Component'}
                                        </Button>
                                    </div>
                                </DialogHeader>

                                <div className="flex-1 grid lg:grid-cols-12 overflow-hidden bg-[#121212] select-none min-h-0">
                                    {/* Left Panel: Layers & Inspector Properties */}
                                    <div className="lg:col-span-3 border-r border-[#333333] bg-[#1e1e1e] flex flex-col overflow-y-auto p-4 gap-4 min-h-0">
                                        <div className="flex items-center gap-1.5 pb-2 border-b border-[#333333]">
                                            <span className="text-[10px] font-black uppercase text-[#888888] tracking-wider">Properties Inspector</span>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="block_name" className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Block Name</Label>
                                            <Input
                                                id="block_name"
                                                value={blockData.name}
                                                onChange={e => setBlockData('name', e.target.value)}
                                                placeholder="e.g. Colored Banner Alert"
                                                className="bg-[#2c2c2c] border-[#444444] text-neutral-100 placeholder-neutral-500 rounded focus:ring-1 focus:ring-[#0d99ff] focus:border-[#0d99ff] text-xs h-8"
                                                required
                                            />
                                            {blockErrors.name && <p className="text-red-400 text-xs">{blockErrors.name}</p>}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="block_type" className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Unique Component ID</Label>
                                            <Input
                                                id="block_type"
                                                value={blockData.type}
                                                onChange={e => setBlockData('type', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                placeholder="e.g. custom_colored_banner"
                                                className="bg-[#2c2c2c] border-[#444444] text-neutral-100 placeholder-neutral-500 rounded focus:ring-1 focus:ring-[#0d99ff] focus:border-[#0d99ff] text-xs h-8"
                                                required
                                                disabled={!!editingBlock}
                                            />
                                            {blockErrors.type && <p className="text-red-400 text-xs">{blockErrors.type}</p>}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="block_description" className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Description</Label>
                                            <textarea
                                                id="block_description"
                                                value={blockData.description}
                                                onChange={e => setBlockData('description', e.target.value)}
                                                placeholder="Enter section description..."
                                                rows={2}
                                                className="flex w-full rounded border border-[#444444] bg-[#2c2c2c] px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d99ff] focus-visible:border-[#0d99ff]"
                                            />
                                        </div>

                                        {/* Parameters inspector */}
                                        <div className="border-t border-[#333333] pt-4 mt-2 flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Component Variables</span>
                                                <button type="button" onClick={handleAddBlockField} className="h-6 text-[10px] font-bold text-[#0d99ff] hover:text-[#18a0fb] flex items-center gap-1 cursor-pointer bg-transparent border-0">
                                                    + Add Variable
                                                </button>
                                            </div>
                                            
                                            <div className="flex flex-col gap-3">
                                                {blockData.fields.map((field, idx) => (
                                                    <div key={idx} className="p-3 border border-[#333333] rounded-lg bg-[#2c2c2c] relative flex flex-col gap-2 group hover:border-[#444444] transition-all">
                                                        <div className="flex justify-between items-center border-b border-[#333333] pb-1.5">
                                                            <span className="text-[9px] font-bold text-[#b3b3b3] uppercase">Variable #{idx + 1}</span>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleRemoveBlockField(idx)}
                                                                className="text-red-400 hover:text-red-500 p-0.5 rounded hover:bg-red-550/15 cursor-pointer"
                                                            >
                                                                <Trash className="size-3" />
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Name / Key</span>
                                                                <Input 
                                                                    value={field.name}
                                                                    onChange={e => handleBlockFieldChange(idx, 'name', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                                    placeholder="e.g. title" 
                                                                    className="h-7 text-[10px] font-mono bg-[#1e1e1e] border-[#333333]"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Display Label</span>
                                                                <Input 
                                                                    value={field.label}
                                                                    onChange={e => handleBlockFieldChange(idx, 'label', e.target.value)}
                                                                    placeholder="e.g. Card Title" 
                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Input Type</span>
                                                                <select 
                                                                    value={field.type} 
                                                                    onChange={e => handleBlockFieldChange(idx, 'type', e.target.value as any)}
                                                                    className="h-7 rounded border border-[#333333] bg-[#1e1e1e] text-[10px] px-1.5 text-neutral-100"
                                                                >
                                                                    <option value="text">Text Input</option>
                                                                    <option value="textarea">Textarea Block</option>
                                                                    <option value="number">Numeric Range</option>
                                                                    <option value="color">Hex Color Picker</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase">Default Val</span>
                                                                <Input 
                                                                    value={field.default}
                                                                    onChange={e => handleBlockFieldChange(idx, 'default', e.target.value)}
                                                                    placeholder="e.g. Welcome" 
                                                                    className="h-7 text-[10px] bg-[#1e1e1e] border-[#333333]"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {blockData.fields.length === 0 && (
                                                    <p className="text-xs text-neutral-500 text-center italic py-2">Add parameters using the button above.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Panel: Design Canvas */}
                                    <div 
                                        className="lg:col-span-6 flex flex-col items-center justify-center p-8 overflow-y-auto relative h-full select-none bg-[#121212]"
                                        style={{
                                            backgroundImage: 'radial-gradient(#222 1px, transparent 1px)',
                                            backgroundSize: '16px 16px',
                                        }}
                                    >
                                        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#1e1e1e] border border-[#333333] px-2.5 py-1 rounded-md text-[9px] text-[#888888] font-bold uppercase">
                                            <span>Canvas Workspace</span>
                                        </div>

                                        {/* Viewport Frame */}
                                        <div className="w-full max-w-[390px] rounded-3xl bg-neutral-900 border border-[#333333] shadow-2xl flex flex-col overflow-hidden relative shrink-0">
                                            {/* Status Bar simulation */}
                                            <div className="h-9 bg-neutral-900 border-b border-[#222222] flex items-center justify-between px-6 text-[10px] text-[#888888] select-none font-bold">
                                                <span>9:41</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span>5G</span>
                                                    <div className="w-4 h-2.5 border rounded-sm border-[#888888]"></div>
                                                </div>
                                            </div>

                                            {/* Rendered Block Container */}
                                            <div className="p-4 min-h-[140px] flex flex-col justify-center bg-white dark:bg-neutral-950 overflow-x-auto text-neutral-900 dark:text-neutral-100">
                                                {(() => {
                                                    try {
                                                        let html = blockData.template_html || '';
                                                        blockData.fields.forEach((field) => {
                                                            const val = field.default || '';
                                                            const escapedName = field.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                                                            html = html.replace(new RegExp(`\\{\\{\\s*${escapedName}\\s*\\}\\}`, 'g'), val);
                                                        });
                                                        return <div dangerouslySetInnerHTML={{ __html: html }} />;
                                                    } catch (e) {
                                                        return <span className="text-red-500 text-xs font-mono">Template compilation error</span>;
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Panel: Template Code Inspector */}
                                    <div className="lg:col-span-3 border-l border-[#333333] bg-[#1e1e1e] flex flex-col overflow-y-auto p-4 gap-4 min-h-0">
                                        <div className="flex items-center gap-1.5 pb-2 border-b border-[#333333]">
                                            <span className="text-[10px] font-black uppercase text-[#888888] tracking-wider">HTML/CSS Blueprint</span>
                                        </div>

                                        <div className="grid gap-2 flex-1 flex flex-col min-h-[250px]">
                                            <Label htmlFor="block_template" className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Template Markup</Label>
                                            <textarea
                                                id="block_template"
                                                value={blockData.template_html}
                                                onChange={e => setBlockData('template_html', e.target.value)}
                                                placeholder="Write custom HTML & Tailwind CSS here..."
                                                className="flex-1 w-full rounded border border-[#333333] bg-[#121212] px-3 py-2 text-[10px] font-mono text-emerald-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d99ff] focus-visible:border-[#0d99ff] leading-relaxed resize-none"
                                                required
                                            />
                                        </div>

                                        <div className="p-3.5 bg-[#2c2c2c] border border-[#333333] rounded-xl text-[10px] text-[#b3b3b3]">
                                            <h5 className="font-bold text-white mb-1.5 uppercase tracking-wide">Blueprint Specs:</h5>
                                            <ul className="list-disc pl-3 space-y-1 text-[#888888] leading-relaxed">
                                                <li>Double curly braces (e.g. <code className="font-mono text-white">{"{{title}}"}</code>) represent component variables.</li>
                                                <li>Variables are substituted instantly inside the centered workspace.</li>
                                                <li>Use regular Tailwind CSS utility classes directly for custom styling.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
