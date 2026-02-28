import React, { useState, useEffect } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Variant, Attribute } from "@/types/inventory";

interface VariantGeneratorProps {
  baseSku: string;
  basePrice: number;
  onVariantsChange: (variants: Variant[], options: Attribute[]) => void;
}

interface ComboAttr {
  name: string;
  value: string;
}

export const VariantGenerator: React.FC<VariantGeneratorProps> = ({
  baseSku,
  basePrice,
  onVariantsChange,
}) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  // Attribute creation state
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  const addAttribute = () => {
    if (!newAttrName) return;
    setAttributes([...attributes, { name: newAttrName, values: [] }]);
    setNewAttrName("");
  };

  const addValueToAttribute = (attrIndex: number) => {
    if (!newAttrValue) return;
    const newAttrs = [...attributes];
    if (!newAttrs[attrIndex].values.includes(newAttrValue)) {
      newAttrs[attrIndex].values.push(newAttrValue);
      setAttributes(newAttrs);
    }
    setNewAttrValue("");
  };

  const removeValue = (attrIndex: number, valIndex: number) => {
    const newAttrs = [...attributes];
    newAttrs[attrIndex].values.splice(valIndex, 1);
    setAttributes(newAttrs);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const generateMatrix = () => {
    if (
      attributes.length === 0 ||
      attributes.some((a) => a.values.length === 0)
    )
      return;

    const cartesian = (arrays: ComboAttr[][]): ComboAttr[][] => {
      let result: ComboAttr[][] = [[]];
      for (const arr of arrays) {
        result = result.flatMap((combo) => arr.map((item) => [...combo, item]));
      }
      return result;
    };

    const attrValues: ComboAttr[][] = attributes.map((a) =>
      a.values.map((v) => ({ name: a.name, value: v })),
    );

    const combinations: ComboAttr[][] =
      attributes.length === 1
        ? attrValues[0].map((v) => [v])
        : cartesian(attrValues);

    const newVariants: Variant[] = combinations.map(
      (combo: ComboAttr[], index: number) => {
        const attrs: Record<string, string> = {};
        combo.forEach((c) => {
          attrs[c.name] = c.value;
        });

        const comboSuffix = combo.map((c) => c.value).join("-");

        return {
          id: `temp-${Date.now()}-${index}`,
          sku: baseSku
            ? `${baseSku}-${comboSuffix.toUpperCase()}`
            : comboSuffix.toUpperCase(),
          attributes: attrs,
          quantity: 0,
          sellingPrice: basePrice,
        };
      },
    );

    setVariants(newVariants);
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | number,
  ) => {
    const newVariants = [...variants];
    const target = newVariants[index];

    if (field === "sku" && typeof value === "string") target.sku = value;
    if (field === "quantity" && typeof value === "number")
      target.quantity = value;
    if (field === "sellingPrice" && typeof value === "number")
      target.sellingPrice = value;

    setVariants(newVariants);
  };

  useEffect(() => {
    onVariantsChange(variants, attributes);
  }, [variants, attributes]);

  return (
    <div className="space-y-6 border rounded-lg p-4 bg-muted/20">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Define Attributes
        </h3>

        {attributes.map((attr, attrIdx) => (
          <div
            key={attrIdx}
            className="space-y-2 p-3 bg-background rounded-md border shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary">{attr.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAttribute(attrIdx)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attr.values.map((val, valIdx) => (
                <Badge key={valIdx} variant="secondary" className="pl-2 gap-1">
                  {val}
                  <button
                    onClick={() => removeValue(attrIdx, valIdx)}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder={`Add ${attr.name} value...`}
                value={newAttrValue}
                onChange={(e) => setNewAttrValue(e.target.value)}
                className="h-8"
              />
              <Button size="sm" onClick={() => addValueToAttribute(attrIdx)}>
                Add
              </Button>
            </div>
          </div>
        ))}

        <div className="flex gap-2">
          <Input
            placeholder="e.g. Size, Color, Material"
            value={newAttrName}
            onChange={(e) => setNewAttrName(e.target.value)}
          />
          <Button variant="outline" onClick={addAttribute} className="gap-2">
            <Plus className="h-4 w-4" /> Add Attribute
          </Button>
        </div>

        <Button
          className="w-full gap-2"
          variant="secondary"
          onClick={generateMatrix}
          disabled={attributes.length === 0}
        >
          <RefreshCw className="h-4 w-4" /> Generate Variant Matrix
        </Button>
      </div>

      {variants.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Review Variants
          </h3>
          <div className="max-h-[300px] overflow-auto border rounded-md">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Variant</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="w-[100px]">Qty</TableHead>
                  <TableHead className="w-[120px]">Price ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((v, i) => (
                  <TableRow key={v.id}>
                    <TableCell className="text-xs font-medium">
                      {Object.values(v.attributes).join(" / ")}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={v.sku}
                        onChange={(e) =>
                          updateVariant(i, "sku", e.target.value)
                        }
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={v.quantity}
                        onChange={(e) =>
                          updateVariant(
                            i,
                            "quantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={v.sellingPrice}
                        onChange={(e) =>
                          updateVariant(
                            i,
                            "sellingPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="h-8 text-xs"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
