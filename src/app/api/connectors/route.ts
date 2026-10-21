import { NextResponse } from "next/server";
import { CONNECTOR_REGISTRY, fetchViaCEP, fetchBrasilAPI_CEP, fetchBrasilAPI_CNPJ, fetchBrasilAPI_DDD } from "@/lib/connectors";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "registry";
  const cep = searchParams.get("cep");
  const cnpj = searchParams.get("cnpj");
  const ddd = searchParams.get("ddd");

  if (action === "viacep" && cep) {
    try { const data = await fetchViaCEP(cep); return NextResponse.json({ ok: true, source: "viacep", data }); }
    catch (e:any){ return NextResponse.json({ ok:false, error:e.message },{status:400}); }
  }
  if (action === "brasilapi-cep" && cep) {
    try { const data = await fetchBrasilAPI_CEP(cep); return NextResponse.json({ ok:true, source:"brasilapi-cep", data }); }
    catch (e:any){ return NextResponse.json({ ok:false, error:e.message },{status:400}); }
  }
  if (action === "cnpj" && cnpj) {
    try { const data = await fetchBrasilAPI_CNPJ(cnpj); return NextResponse.json({ ok:true, source:"brasilapi-cnpj", data }); }
    catch (e:any){ return NextResponse.json({ ok:false, error:e.message },{status:400}); }
  }
  if (action === "ddd" && ddd) {
    try { const data = await fetchBrasilAPI_DDD(ddd); return NextResponse.json({ ok:true, source:"brasilapi-ddd", data }); }
    catch (e:any){ return NextResponse.json({ ok:false, error:e.message },{status:400}); }
  }
  // default: lista registry + instruções — nada muda no visual
  return NextResponse.json({
    ok: true,
    note: "APIs grátis auto-configuráveis — nada muda no visual. Use via /api/connectors?action=viacep&cep=74000000",
    registry: CONNECTOR_REGISTRY,
    endpoints: [
      "GET /api/connectors — lista registry",
      "GET /api/connectors?action=viacep&cep=74000000",
      "GET /api/connectors?action=brasilapi-cep&cep=74000000",
      "GET /api/connectors?action=cnpj&cnpj=00000000000191",
      "GET /api/connectors?action=ddd&ddd=62",
    ],
    clientModule: "src/lib/connectors.ts — AutoConnector + initConnectors() + fetchViaCEP/BrasilAPI helpers",
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const { cep, cnpj, ddd, ceps, cnpjs } = body as { cep?:string; cnpj?:string; ddd?:string; ceps?:string[]; cnpjs?:string[] };
  const out:any = { ok:true };
  if (cep) try{ out.viacep = await fetchViaCEP(cep); }catch(e:any){ out.viacepError=e.message; }
  if (ceps?.length) {
    out.ceps = [];
    for (const c of ceps.slice(0,10)) {
      try{ out.ceps.push({ cep:c, data: await fetchViaCEP(c)}); }catch(e:any){ out.ceps.push({ cep:c, error:e.message}); }
    }
  }
  if (cnpj) try{ out.cnpj = await fetchBrasilAPI_CNPJ(cnpj); }catch(e:any){ out.cnpjError=e.message; }
  if (cnpjs?.length) {
    out.cnpjsResult = [];
    for (const c of cnpjs.slice(0,5)) {
      try{ out.cnpjsResult.push({ cnpj:c, data: await fetchBrasilAPI_CNPJ(c)}); }catch(e:any){ out.cnpjsResult.push({ cnpj:c, error:e.message}); }
    }
  }
  if (ddd) try{ out.ddd = await fetchBrasilAPI_DDD(ddd); }catch(e:any){ out.dddError=e.message; }
  return NextResponse.json(out);
}
