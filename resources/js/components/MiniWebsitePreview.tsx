import React from 'react';

export default function MiniWebsitePreview({ config }: { config: any }) {
    if (!config || !config.pages || config.pages.length === 0) return null;

    const page = config.pages[0];
    const blocks = page.blocks || [];
    const bgBlock = blocks.find((b: any) => b.type === 'background');
    const bgStyle = bgBlock
        ? (bgBlock.src
            ? { backgroundImage: `url(${bgBlock.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { backgroundColor: bgBlock.bgColor })
        : { backgroundColor: '#f9fafb' };

    return (
        <div className="relative w-full h-[600px] overflow-hidden pointer-events-none origin-top-left" style={{ containerType: 'inline-size' as any, ...bgStyle }}>
            {blocks.filter((b: any) => b.type !== 'background').map((b: any) => (
                <div
                    key={b.id}
                    style={{
                        position: 'absolute',
                        left: `${b.x}cqw`,
                        top: `${b.y}cqw`,
                        width: b.w ? `${b.w}cqw` : undefined,
                        height: b.h ? `${b.h}cqw` : undefined,
                        zIndex: b.zIndex || 1,
                        color: b.color,
                        fontSize: b.fontSize ? `${b.fontSize}cqw` : undefined,
                        fontWeight: b.fontWeight,
                        fontFamily: b.fontFamily,
                        textAlign: b.textAlign,
                        backgroundColor: b.bgColor,
                        borderRadius: b.borderRadius ? `${b.borderRadius}cqw` : undefined,
                        display: b.type === 'button' ? 'flex' : 'block',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    {b.type === 'text' && <div dangerouslySetInnerHTML={{ __html: b.content || '' }} />}
                    {b.type === 'image' && b.src && (
                        <img src={b.src} alt="" className="w-full h-full object-cover" />
                    )}
                    {b.type === 'button' && (
                        <span style={{ color: b.color || '#fff' }}>{b.content}</span>
                    )}
                    {b.type === 'video' && b.src && (
                        <video src={b.src} className="w-full h-full object-cover" muted loop playsInline />
                    )}
                </div>
            ))}
        </div>
    );
}
