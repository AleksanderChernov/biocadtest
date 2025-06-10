"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Card } from "../ui/card";
import { useState } from "react";

const aminoAcidGroups = {
  cistein: ["C"],
  hydrophobic: ["A", "I", "L", "M", "F", "W", "Y", "V", "P"],
  glycin: ["G"],
  negative: ["D", "E"],
  positive: ["K", "R"],
  polar: ["S", "T", "H", "Q", "N"],
};

const aminoAcidColors: { [key: string]: string } = {
  cistein: "bg-cistein",
  hydrophobic: "bg-hydrophobic",
  glycin: "bg-glycin",
  negative: "bg-negative",
  positive: "bg-positive",
  polar: "bg-polar",
};

const aminoacidAllowedSymbolsSchema = z
  .string()
  .min(1, { message: "Обязательное поле" })
  .regex(/^[ARNDCEQGHILKMFPSTWYV-]+$/i, {
    message: "Допустимы только латинские буквы аминокислот и символ '-'",
  });

const sequenceSchema = z
  .object({
    sequence1: aminoacidAllowedSymbolsSchema,
    sequence2: aminoacidAllowedSymbolsSchema,
  })
  .refine((data) => data.sequence1.length === data.sequence2.length, {
    message: "Длины последовательностей должны совпадать",
    path: ["sequence2"],
  });

type SequenceSchemaType = z.infer<typeof sequenceSchema>;

export default function AminoacidsWrapper() {
  const [aminoacidStrings, setAminoacidStrings] =
    useState<SequenceSchemaType | null>(null);
  const form = useForm<SequenceSchemaType>({
    resolver: zodResolver(sequenceSchema),
    defaultValues: {
      sequence1: "",
      sequence2: "",
    },
  });

  const sequence1 = form.watch("sequence1");
  const sequence2 = form.watch("sequence2");

  const onSubmit = (data: SequenceSchemaType) => {
    setAminoacidStrings(data);
  };

  const getAminoAcidColor = (aminoAcid: string): string => {
    for (const group in aminoAcidGroups) {
      if (
        aminoAcidGroups[group as keyof typeof aminoAcidGroups].includes(
          aminoAcid
        )
      ) {
        return aminoAcidColors[group];
      }
    }

    return "bg-gray-300";
  };

  const getDiffenceColor = (aminoAcid1: string, aminoAcid2: string): string => {
    if (aminoAcid1 !== aminoAcid2) {
      return "bg-red-500";
    }
    return "";
  };

  return (
    <Card className="flex flex-col items-center justify-center max-w-4xl py-20 px-6 mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center space-y-6 max-w-xl"
        >
          <FormField
            control={form.control}
            name="sequence1"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormLabel>Последовательность 1:</FormLabel>
                <FormControl>
                  <Input
                    className="w-64 text-center"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value.toUpperCase());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sequence2"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormLabel>Последовательность 2:</FormLabel>
                <FormControl>
                  <Input
                    className="w-64 text-center"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value.toUpperCase());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              !sequence1 &&
              !sequence2 &&
              !form.formState.errors.sequence1 &&
              !form.formState.errors.sequence2
            }
          >
            Сравнить
          </Button>
        </form>
      </Form>

      {aminoacidStrings &&
        !form.formState.errors.sequence1 &&
        !form.formState.errors.sequence2 && (
          <div className="flex text-black flex-wrap p-6">
            {aminoacidStrings.sequence1.split("").map((aminoAcid1, index) => {
              const aminoAcid2 = aminoacidStrings.sequence2[index];
              return (
                <div key={index} className="flex flex-col items-center">
                  <p
                    className={`px-1 py-0.5 rounded ${getAminoAcidColor(
                      aminoAcid1
                    )}`}
                  >
                    {aminoAcid1}
                  </p>
                  <p
                    className={`text-white px-1 py-0.5 rounded ${getDiffenceColor(
                      aminoAcid1,
                      aminoAcid2
                    )}`}
                  >
                    {aminoAcid2}
                  </p>
                </div>
              );
            })}
          </div>
        )}
    </Card>
  );
}
