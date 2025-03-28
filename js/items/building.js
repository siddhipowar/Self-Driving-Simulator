class Building {
    constructor(poly, heightCoef = 0.4) {
        this.base = poly;
        this.heightCoef = heightCoef;

        const types = ["windows", "roof"];
        this.type = types[Math.floor(Math.random() * types.length)];
    }

    draw(ctx, viewPoint) {
        const topPoints = this.base.points.map((p) =>
            add(p, scale(subtract(p, viewPoint), this.heightCoef))
        );
        const ceiling = new Polygon(topPoints);

        const sides = [];
        for (let i = 0; i < this.base.points.length; i++) {
            const nextI = (i + 1) % this.base.points.length;
            const poly = new Polygon([
                this.base.points[i], this.base.points[nextI],
                topPoints[nextI], topPoints[i]
            ]);
            sides.push(poly);
        }

        sides.sort(
            (a, b) =>
                b.distanceToPoint(viewPoint) - 
                a.distanceToPoint(viewPoint)
        );

        // Base and sides
        const baseColor = "#DDD";
        const sideColor = "#BBB";
        const strokeColor = "#999";

        this.base.draw(ctx,  {fill: "baseColor", stroke: strokeColor});
        for (const side of sides) {
            side.draw(ctx,  {fill: sideColor, stroke: strokeColor});

            if (this.type === "windows") {
                this.#drawWindows(ctx, side);
            }
        }

        if (this.type === "roof") {
            ceiling.draw(ctx,  {fill: "white", stroke: "#888"});
        }
        
    }

    #drawWindows(ctx, sidePoly) {
        // draw small rectangles (windows) on each side
        const bounds = this.#getSideBounds(sidePoly.points);
        const windowWidth = 10;
        const windowHeight = 16;
        const gapX = 20;
        const gapY = 25;

        for (let x = bounds.left + 10; x < bounds.right - windowWidth; x += gapX) {
            for (let y = bounds.top + 10; y < bounds.bottom - windowHeight; y += gapY) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                ctx.fillRect(x, y, windowWidth, windowHeight);
                ctx.strokeStyle = "rgba(200, 200, 200, 0.7)";
                ctx.strokeRect(x, y, windowWidth, windowHeight);
            }
        }
    }

    #getSideBounds(points) {
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        return {
            left: Math.min(...xs),
            right: Math.max(...xs),
            top: Math.min(...ys),
            bottom: Math.max(...ys),
        };
    }
}